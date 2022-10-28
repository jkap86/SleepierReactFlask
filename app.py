from flask import Flask
import requests
from requests.adapters import HTTPAdapter, Retry
import concurrent.futures
import itertools
import json
from bs4 import BeautifulSoup
import re

app = Flask(__name__, static_folder='build/', static_url_path='/')


def fetchAllPlayers():
    print('fetching All Players...')
    allplayers = requests.get('https://api.sleeper.app/v1/players/nfl').json()
    with open('./src/allplayers.json', "w") as fo:
        fo.write(json.dumps(allplayers))
        fo.close()
    print('All Players updated...')
    return 'All Players updated...'


def fetchWeeklyRankings():
    print('fetching weekly rankings...')

    html_sf = requests.get(
        'https://www.fantasypros.com/nfl/rankings/ppr-superflex.php').text
    html_qb = requests.get(
        'https://www.fantasypros.com/nfl/rankings/qb.php').text
    html_rb = requests.get(
        'https://www.fantasypros.com/nfl/rankings/ppr-rb.php').text
    html_wr = requests.get(
        'https://www.fantasypros.com/nfl/rankings/ppr-wr.php').text
    html_te = requests.get(
        'https://www.fantasypros.com/nfl/rankings/ppr-te.php').text

    soup_sf = BeautifulSoup(html_sf, 'html.parser')
    players = []
    for script in soup_sf.find_all('script'):
        script_text = script.get_text()
        if 'var ecrData' in script_text:
            players.append(script_text)

    data = re.search(
        "players\\\"\:\[(.*)\]\,\\\"experts_available", players[0]).group(1)

    data = data.replace("},{", "}-----{")
    data = data.split("-----")

    playersDict = {}
    for item in data:
        player = json.loads(item)
        playersDict[player['player_id']] = player

    def getProjPts(html_pos):
        soup_pos = BeautifulSoup(html_pos, 'html.parser')
        for script in soup_pos.find_all('script'):
            script_text = script.get_text()
            if ('var ecrData') in script_text:
                data_pos = re.search(
                    "players\\\"\:\[(.*)\]\,\\\"experts_available", script_text).group(1)
                data_pos = data_pos.replace("},{", "}-----{")
                data_pos = data_pos.split("-----")

                for item in data_pos:
                    player = json.loads(item)
                    playerDict = playersDict.get(player['player_id'], None)
                    if playerDict:
                        playersDict[player['player_id']
                                    ]['proj_fpts'] = player.get('r2p_pts', 0)

    getProjPts(html_qb)
    getProjPts(html_rb)
    getProjPts(html_wr)
    getProjPts(html_te)

    with open('./src/weekly_rankings.json', "w") as fo:
        fo.write(json.dumps(playersDict))
        fo.close()

    return data


def fetchInjuries():
    nfl_state = requests.get('https://api.sleeper.app/v1/state/nfl').json()
    injuries = requests.get(
        'https://partners.fantasypros.com/api/v1/player-injuries.php?sport=NFL&year=2022&week=' + str(nfl_state['week'])).json()

    with open('./src/injuries.json', "w") as fo:
        fo.write(json.dumps(injuries['injuries']))
        fo.close()
    print('Injury data updated!')
    return 'Injury data updated!'


def fetchSleeperProjections():
    nfl_state = requests.get('https://api.sleeper.app/v1/state/nfl').json()
    week_proj = requests.get('https://api.sleeper.com/projections/nfl/2022/' + str(
        nfl_state['week']) + '?season_type=regular&position[]=QB&position[]=WR&position[]=RB&position[]=TE').json()

    with open('./src/weekly_projections.json', "w") as fo:
        fo.write(json.dumps(week_proj))
        fo.close()
    print('Projections updated!')
    return 'Projections updated!'


def getLeagueInfo(league, user_id):
    sleeperapi = requests.Session()
    retry = Retry(connect=5, backoff_factor=.5)
    adapter = HTTPAdapter(max_retries=retry)
    sleeperapi.mount('http://', adapter)
    sleeperapi.mount('https://', adapter)

    users = sleeperapi.get(
        'https://api.sleeper.app/v1/league/' + str(league['league_id']) + '/users').json()

    rosters = sleeperapi.get(
        'https://api.sleeper.app/v1/league/' + str(league['league_id']) + '/rosters').json()

    userRoster = next(iter([x for x in rosters if x['owner_id'] == user_id or
                            (x['co_owners'] != None and user_id in x['co_owners'])]), None)

    league = {
        'league_id': league['league_id'],
        'name': league['name'],
        'avatar': league['avatar'],
        'settings': league['settings'],
        'scoring_settings': league['scoring_settings'],
        'roster_positions': league['roster_positions'],
        'total_rosters': league['total_rosters'],
        'wins': userRoster['settings']['wins'] if userRoster != None else 0,
        'losses': userRoster['settings']['losses'] if userRoster != None else 0,
        'ties': userRoster['settings']['ties'] if userRoster != None else 0,
        'fpts': float(str(userRoster['settings']['fpts']) +
                      "." + str(userRoster['settings']['fpts_decimal']))
        if userRoster != None and 'fpts_decimal' in userRoster['settings'].keys() else
        0,
        'fpts_against': float(str(userRoster['settings']['fpts_against']) +
                              "." + str(userRoster['settings']['fpts_against_decimal']))
        if userRoster != None and 'fpts_against' in userRoster['settings'].keys() else
        0,
        'rosters': rosters,
        'users': users,
        'userRoster': userRoster,
        'dynasty': 'Dynasty' if league['settings']['type'] == 2 else 'Redraft',
        'bestball': 'Bestball' if ('best_ball' in league['settings'].keys(
        ) and league['settings']['best_ball'] == 1) else 'Standard'
    }

    if userRoster and userRoster['players']:
        return league


@app.route('/user/<username>')
def getUser(username):
    user = requests.get(
        'https://api.sleeper.app/v1/user/' + str(username)
    ).json()
    if (user == None):
        user = 'Invalid'

    return user


@app.route('/leagues/<user_id>', methods=['GET', 'POST'])
def getLeagues(user_id):
    leagues = requests.get(
        'https://api.sleeper.app/v1/user/' + str(user_id) + '/leagues/nfl/2022').json()

    with concurrent.futures.ProcessPoolExecutor(max_workers=10) as executor:
        leagues_detailed = list(executor.map(
            getLeagueInfo, leagues, itertools.repeat(user_id)))

    return {
        'leagues': leagues_detailed
    }


@app.route('/sync/weeklyrankings')
def syncWeeklyRankings():
    fetchWeeklyRankings()
    return 'sync complete'


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/<path>')
def catch_all(path):
    return app.send_static_file('index.html')
