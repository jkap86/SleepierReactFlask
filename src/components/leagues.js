import React, { useState, useEffect } from "react";
import { getLineupCheck } from './projections_stats';
const LineupBreakdown = React.lazy(() => import('./lineupBreakdown'));
const LeagueRosters = React.lazy(() => import('./leagueRosters'));
const Search = React.lazy(() => import('./search'));

const Leagues = ({ prop_leagues, user_id, avatar, weekly_rankings }) => {
    const [leagues, setLeagues] = useState([])
    const [searched, setSearched] = useState('')
    const [page, setPage] = useState(1)
    const [rostersVisible, setRostersVisible] = useState([])
    const [lineupCheck, setLineupCheck] = useState(false);
    const [sortedBy, setSortedBy] = useState({
        by: 'default',
        descending: true
    })


    const toggleRosters = (league_id) => {
        let rv = rostersVisible;
        if (rv.includes(league_id)) {
            rv = rv.filter(x => x !== league_id)
        } else {
            rv.push(league_id)
        }
        setRostersVisible([...rv])
    }

    const sortLeagues = (sort_by) => {
        let l = leagues
        let sb = sortedBy
        let d = sb.by === sort_by ? !sb.descending : true

        switch (sort_by) {
            case 'Record':
                if (sb.descending) {
                    l = l.sort((a, b) =>
                        (b.wins / (b.wins + b.losses + b.ties)) -
                        (a.wins / (a.wins + a.losses + a.ties))
                    )
                } else {
                    l = l.sort((a, b) =>
                        (a.wins / (a.wins + a.losses + a.ties)) -
                        (b.wins / (b.wins + b.losses + b.ties))
                    )
                }
                break;
            case 'PF':
                if (sb.descending) {
                    l = l.sort((a, b) =>
                        b.fpts - a.fpts || b.fpts_decimal - a.fpts_decimal
                    )
                } else {
                    l = l.sort((a, b) =>
                        a.fpts - b.fpts || a.fpts_decimal - b.fpts_decimal
                    )
                }
                break;
            case 'PA':
                if (sb.descending) {
                    l = l.sort((a, b) =>
                        b.fpts_against - a.fpts_against || b.fpts_against_decimal - a.fpts_against_decimal
                    )
                } else {
                    l = l.sort((a, b) =>
                        a.fpts_against - b.fpts_against || a.fpts_against_decimal - b.fpts_against_decimal
                    )
                }
                break;
            case 'Rank (Ovr)':
                if (sb.descending) {
                    l = l.sort((a, b) => a.rank - b.rank)
                } else {
                    l = l.sort((a, b) => b.rank - a.rank)
                }
                break;
            case 'Rank (PF)':
                if (sb.descending) {
                    l = l.sort((a, b) => a.rank_points - b.rank_points)
                } else {
                    l = l.sort((a, b) => b.rank_points - a.rank_points)
                }
                break;
            case 'League':
                if (sb.descending) {
                    l = l.sort((a, b) => a.index - b.index)
                } else {
                    l = l.sort((a, b) => a.name > b.name ? 1 : -1)
                }
                break;
            default:
                break;
        }
        setSortedBy({
            by: sort_by,
            descending: d
        })
        setLeagues([...l])
    }


    useEffect(() => {
        const l = prop_leagues.map((league, index) => {
            league['index'] = index
            const standings = league.rosters.sort((a, b) =>
                b.settings.wins - a.settings.wins || b.settings.losses - a.settings.losses ||
                b.settings.fpts - a.settings.fpts
            )
            const rank = standings.findIndex(obj => {
                return obj.owner_id === user_id || obj.co_owners?.includes(user_id)
            })
            league['percent_of'] = {
                first: (league.fpts /
                    parseFloat(
                        `${standings[0]?.settings?.fpts}.${standings[0]?.settings?.fpts_decimal}`
                    )) * 100,
                second: (league.fpts /
                    parseFloat(
                        `${standings[1]?.settings?.fpts}.${standings[1]?.settings?.fpts_decimal}`
                    )) * 100,
                third: (league.fpts /
                    parseFloat(
                        `${standings[2]?.settings?.fpts}.${standings[2]?.settings?.fpts_decimal}`
                    )) * 100,
                fourth: (league.fpts /
                    parseFloat(
                        `${standings[3]?.settings?.fpts}.${standings[3]?.settings?.fpts_decimal}`
                    )) * 100,
                fifth: (league.fpts /
                    parseFloat(
                        `${standings[4]?.settings?.fpts}.${standings[4]?.settings?.fpts_decimal}`
                    )) * 100,
                sixth: (league.fpts /
                    parseFloat(
                        `${standings[5]?.settings?.fpts}.${standings[5]?.settings?.fpts_decimal}`
                    )) * 100
            };
            league['rank'] = rank + 1
            const standings_points = league.rosters.sort((a, b) =>
                b.settings.fpts - a.settings.fpts || b.settings.wins - a.settings.wins
            )
            const rank_points = standings_points.findIndex(obj => {
                return obj.owner_id === user_id || obj.co_owners?.includes(user_id)
            })
            league['standings_points'] = standings_points;
            league['rank_points'] = rank_points + 1
            return league
        })
        setLeagues([...l])
    }, [prop_leagues])

    useEffect(() => {
        setPage(1)
    }, [searched, prop_leagues])

    const header_standings = (
        <>
            <tr className="main_header single">
                <th colSpan={4}
                    className={'clickable'}
                    onClick={() => sortLeagues('League')}
                >
                    League
                </th>
                <th colSpan={3}
                    className={'clickable'}
                    onClick={() => sortLeagues('Record')}
                >
                    Record
                </th>
                <th colSpan={4}
                    className={'clickable'}
                    onClick={() => sortLeagues('PF')}
                >
                    PF - PA
                </th>
                <th colSpan={1}
                    className={'small clickable'}
                    onClick={() => sortLeagues('Rank (Ovr)')}
                >
                    Rank (Ovr)
                </th>
                <th colSpan={1}
                    className={'small clickable'}
                    onClick={() => sortLeagues('Rank (PF)')}
                >
                    Rank (PF)
                </th>
            </tr>

        </>
    )

    const header_lineup_check = (
        <>
            <tr className="main_header single">
                <th colSpan={4}
                    className={'clickable'}
                    onClick={() => sortLeagues('League')}
                >
                    League
                </th>
                <th colSpan={2}>
                    Empty Starter Slots
                </th>
                <th colSpan={2}>
                    Suboptimal Slots
                </th>
            </tr>
        </>
    )

    const leagues_display = searched.trim().length === 0 ? leagues :
        leagues.filter(x => x.name.trim() === searched.trim())

    const display_standings = (
        leagues_display
            .slice(Math.max((page - 1) * 25, 0), ((page - 1) * 25) + 25)
            .map((league, index) =>
                <tbody
                    key={`${league.league_id}_${index}`}
                    className={rostersVisible.includes(league.league_id) ? 'active' : null}
                >
                    <tr>
                        <td colSpan={13} >
                            <table className={`table${1}`}>
                                <tbody>
                                    <tr
                                        className={rostersVisible.includes(league.league_id) ? 'main_row active clickable' : 'main_row clickable'}
                                        onClick={() => toggleRosters(league.league_id)}
                                    >
                                        <td colSpan={4} className={'left'}>
                                            <p>
                                                {
                                                    avatar(league.avatar, league.name, 'league')
                                                }
                                                {league.name}
                                            </p>
                                        </td>
                                        <td colSpan={3}>
                                            {
                                                `${league.wins}-${league.losses}${league.ties > 0 ? `-${league.ties}` : ''}`
                                            }
                                            &nbsp;&nbsp;
                                            <em>
                                                {
                                                    (league.wins / (league.wins + league.losses + league.ties)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                                                }
                                            </em>
                                        </td>
                                        <td colSpan={4}>
                                            {
                                                league.fpts?.toLocaleString("en-US")
                                            } - {
                                                league.fpts_against?.toLocaleString("en-US")
                                            }
                                        </td>
                                        <td>
                                            <p
                                                className={
                                                    (league.rank / league.total_rosters) <= .25 ? 'green' :
                                                        (league.rank / league.total_rosters) >= .75 ? 'red' :
                                                            null
                                                }
                                            >
                                                {
                                                    league.rank
                                                }
                                            </p>
                                        </td>
                                        <td>
                                            <p
                                                className={
                                                    (league.rank_points / league.total_rosters) <= .25 ? 'green' :
                                                        (league.rank_points / league.total_rosters) >= .75 ? 'red' :
                                                            null
                                                }
                                            >
                                                {
                                                    league.rank_points
                                                }
                                            </p>
                                        </td>
                                    </tr>
                                    {
                                        !rostersVisible.includes(league.league_id) ? null :
                                            <tr>
                                                <td colSpan={13}>
                                                    <div className={`nav2`}></div>
                                                    <React.Suspense fallback={
                                                        <div className='logo_wrapper'>
                                                            <div className='z one'>Z</div>
                                                            <div className='z two'>Z</div>
                                                            <div className='z three'>Z</div>
                                                        </div>}>
                                                        <LeagueRosters
                                                            type={2}
                                                            rosters={league.rosters}
                                                            users={league.users}
                                                            avatar={avatar}
                                                            roster_positions={league.roster_positions}
                                                            user_id={user_id}
                                                        />
                                                    </React.Suspense>
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            )
    )

    const display_lineup_check = (
        leagues_display
            .slice(Math.max((page - 1) * 25, 0), ((page - 1) * 25) + 25)
            .map((league, index) =>
                <tbody
                    key={`${league.league_id}_${index}`}
                    className={rostersVisible.includes(league.league_id) ? 'active' : null}
                >
                    <tr>
                        <td colSpan={8} >
                            <table className={`table${1}`}>
                                <tbody>
                                    <tr
                                        className={rostersVisible.includes(league.league_id) ? 'main_row active clickable' : 'main_row clickable'}
                                        onClick={() => toggleRosters(league.league_id)}
                                    >
                                        <td colSpan={4} className={'left'}>
                                            <p>
                                                {
                                                    avatar(league.avatar, league.name, 'league')
                                                }
                                                {league.name}
                                            </p>
                                        </td>
                                        <td colSpan={2}>
                                            {
                                                league.userRoster.starters.filter(s => s === '0').length
                                            }
                                        </td>
                                        <td colSpan={2}>
                                            {
                                                getLineupCheck(league.roster_positions, league.userRoster, weekly_rankings)
                                                    .filter(slot => slot.subs.length > 0).length
                                            }
                                        </td>
                                    </tr>
                                    {
                                        !rostersVisible.includes(league.league_id) ? null :
                                            <tr>
                                                <td colSpan={8}>
                                                    <div className={`nav2`}></div>
                                                    <React.Suspense fallback={
                                                        <div className='logo_wrapper'>
                                                            <div className='z one'>Z</div>
                                                            <div className='z two'>Z</div>
                                                            <div className='z three'>Z</div>
                                                        </div>}>
                                                        <LineupBreakdown
                                                            type={2}
                                                            roster={league.userRoster}
                                                            lineup_check={getLineupCheck(league.roster_positions, league.userRoster, weekly_rankings)}
                                                            avatar={avatar}
                                                            weekly_rankings={weekly_rankings}
                                                        />
                                                    </React.Suspense>
                                                </td>
                                            </tr>
                                    }
                                </tbody>
                            </table>
                        </td>
                    </tr>
                </tbody>
            )
    )

    const header = lineupCheck ? header_lineup_check : header_standings
    const display = lineupCheck ? display_lineup_check : display_standings

    return <>
        <button
            className={lineupCheck ? 'active clickable' : 'clickable'}
            onClick={() => setLineupCheck(prevState => !prevState)}
        >
            Lineup Check
        </button>
        <React.Suspense fallback={<>...</>}>
            <Search
                list={leagues.map(league => league.name)}
                placeholder={'Search Leagues'}
                sendSearched={(data) => setSearched(data)}
            />
        </React.Suspense>
        <div className="page_numbers_wrapper">
            <ol className="page_numbers">
                {Array.from(Array(Math.ceil(leagues_display.length / 25)).keys()).map(key => key + 1).map(page_number =>
                    <li className={page === page_number ? 'active clickable' : 'clickable'} key={page_number} onClick={() => setPage(page_number)}>
                        {page_number}
                    </li>
                )}
            </ol>
        </div>
        <table className="main">
            <thead className="main">
                {header}
            </thead>
            {display}
        </table>
    </>
}

export default React.memo(Leagues);