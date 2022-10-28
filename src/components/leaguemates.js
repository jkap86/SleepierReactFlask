import React, { useState, useEffect } from "react";
const LeaguemateLeagues = React.lazy(() => import('./leaguemateLeagues'));
const Search = React.lazy(() => import('./search'));

const Leaguemates = (props) => {
    const [leaguemates, setLeaguemates] = useState([])
    const [searched, setSearched] = useState('')
    const [page, setPage] = useState(1)
    const [leaguesVisible, setLeaguesVisible] = useState([])

    const toggleLeagues = (leaguemate_id) => {
        let lv = leaguesVisible;
        if (lv.includes(leaguemate_id)) {
            lv = lv.filter(x => x !== leaguemate_id)
            console.log(lv)
        } else {
            lv.push(leaguemate_id)
        }
        setLeaguesVisible([...lv])
    }

    useEffect(() => {
        setLeaguemates(props.leaguemates.sort((a, b) => b.leagues.length - a.leagues.length))
    }, [props])

    useEffect(() => {
        setPage(1)
    }, [searched, props.leaguemates])

    const header = (
        <>
            <tr className="main_header double">
                <th colSpan={4} rowSpan={2} >Leaguemate</th>
                <th colSpan={2} rowSpan={2}>Leagues</th>
                <th colSpan={6}>Leaguemate</th>
                <th colSpan={6}>{props.username}</th>
            </tr>
            <tr className="main_header double">
                <th colSpan={3}>Record</th>
                <th colSpan={3}>WinPCT</th>
                <th colSpan={3}>Record</th>
                <th colSpan={3}>WinPCT</th>
            </tr>
        </>
    )

    const leaguemates_display = searched.trim().length === 0 ? leaguemates.filter(x => x.user_id !== props.user_id) :
        leaguemates.filter(x => x.display_name.trim() === searched.trim())

    const display = (
        leaguemates_display.slice((page - 1) * 50, ((page - 1) * 50) + 50).map((leaguemate, index) =>
            <tbody
                key={`${leaguemate.user_id}_${index}`}
            >
                <tr>
                    <td colSpan={18}>
                        <table className={`table${1}`}>
                            <tbody>
                                <tr
                                    className={leaguesVisible.includes(leaguemate.user_id) ? 'main_row active clickable' : 'main_row clickable'}
                                    onClick={() => toggleLeagues(leaguemate.user_id)}
                                >
                                    <td colSpan={4} className={'left'}>
                                        <p>
                                            {
                                                props.avatar(leaguemate.avatar, leaguemate.display_name, 'user')
                                            }
                                            {leaguemate.display_name}
                                        </p>
                                    </td>
                                    <td colSpan={2}>
                                        {
                                            leaguemate.leagues.length
                                        }
                                    </td>
                                    <td colSpan={3}>
                                        {
                                            leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster?.settings.wins, 0)
                                        }
                                        -
                                        {
                                            leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster?.settings.losses, 0)
                                        }
                                    </td>
                                    <td colSpan={3}>
                                        <em>
                                            {
                                                (leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster?.settings.wins, 0) /
                                                    leaguemate.leagues.reduce((acc, cur) => acc + cur.lmroster?.settings.wins + cur.lmroster?.settings.losses, 0)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                                            }
                                        </em>
                                    </td>
                                    <td colSpan={3}>
                                        {
                                            leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.wins, 0)
                                        }
                                        -
                                        {
                                            leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.losses, 0)
                                        }
                                    </td>
                                    <td colSpan={3}>
                                        <em>
                                            {
                                                (leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.wins, 0) /
                                                    leaguemate.leagues.reduce((acc, cur) => acc + cur.roster.settings.wins + cur.roster.settings.losses, 0)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                                            }
                                        </em>
                                    </td>
                                </tr>
                                {
                                    !leaguesVisible.includes(leaguemate.user_id) ? null :
                                        <tr>
                                            <td colSpan={18}>
                                                <React.Suspense fallback={
                                                    <div className='logo_wrapper'>
                                                        <div className='z one'>Z</div>
                                                        <div className='z two'>Z</div>
                                                        <div className='z three'>Z</div>
                                                    </div>
                                                }>
                                                    <LeaguemateLeagues
                                                        type={2}
                                                        leagues={leaguemate.leagues}
                                                        leaguemate={leaguemate.display_name}
                                                        username={props.username}
                                                        avatar={props.avatar}
                                                        user_id={props.user_id}
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
    return <>
        <React.Suspense fallback={<>...</>}>
            <Search
                list={leaguemates.map(leaguemate => leaguemate.display_name)}
                placeholder={'Search Leaguemates'}
                sendSearched={(data) => setSearched(data)}
            />
        </React.Suspense>
        <div className="page_numbers_wrapper">
            <ol className="page_numbers">
                {Array.from(Array(Math.ceil(leaguemates_display.length / 50)).keys()).map(key => key + 1).map(page_number =>
                    <li className={page === page_number ? 'active clickable' : 'clickable'} key={page_number} onClick={() => setPage(page_number)}>
                        {page_number}
                    </li>
                )}
            </ol>
        </div>
        <div className="scrollable">
            <table className="main">
                <thead className="main">
                    {header}
                </thead>
                {display}
            </table>
        </div>
    </>
}

export default React.memo(Leaguemates);