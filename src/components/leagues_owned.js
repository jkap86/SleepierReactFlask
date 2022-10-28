import React, { useState } from "react";

const Leagues_Owned = ({ leagues_owned, type, avatar }) => {
    const [rostersVisible, setRostersVisible] = useState([]);
    const [page, setPage] = useState(1)
    const [filterStatus, setFilterStatus] = useState('All')

    const toggleRosters = (league_id) => {
        let rv = rostersVisible;
        if (rv.includes(league_id)) {
            rv = rv.filter(x => x !== league_id)
        } else {
            rv.push(league_id)
        }
        setRostersVisible([...rv])
    }

    return <>
        <table className={`table${type}`}>
            <thead>
                <tr className={'single'}>
                    <th colSpan={4}>League</th>
                    <th colSpan={2}
                        className={'filter'}
                    >
                        Status
                        <i
                            className={'fa fa-filter'}
                        >
                            <select
                                className="invisible"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option>All</option>
                                <option>Starter</option>
                                <option>Bench</option>
                                <option value={'Taxi'}>Taxi</option>
                                <option>IR</option>
                            </select>
                        </i>
                    </th>
                    <th colSpan={3}>Record</th>
                    <th colSpan={2}>PF</th>
                    <th colSpan={2}>PA</th>
                    <th colSpan={1} className="small">
                        Rank (Ovr)
                    </th>
                    <th colSpan={1} className="small">
                        Rank (PF)
                    </th>
                </tr>
            </thead>
            {
                leagues_owned
                    .filter(x => filterStatus === 'All' || filterStatus === x.status)
                    .map((league, index) =>
                        <tbody
                            key={`${league.league_id}_${index}`}
                        >
                            <tr
                                className={rostersVisible.includes(league.league_id) ? `row${type} active` : `row${type}`}
                                onClick={() => toggleRosters(league.league_id)}
                            >
                                <td colSpan={1} >
                                    {
                                        avatar(league.league_avatar, league.league_name, 'league')
                                    }
                                </td>
                                <td colSpan={3} className="left">
                                    <p>
                                        {league.league_name}
                                    </p>
                                </td>
                                <td colSpan={2}>{league.status}</td>
                                <td colSpan={3}>
                                    {
                                        `${league.wins}-${league.losses}${league.ties > 0 ? league.ties : ''}`
                                    }
                                    &nbsp;&nbsp;
                                    <em>
                                        {
                                            (league.wins / (league.wins + league.losses + league.ties)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                                        }
                                    </em>
                                </td>
                                <td colSpan={2}>
                                    {
                                        league.fpts.toLocaleString("en-US")
                                    }
                                </td>
                                <td colSpan={2}>
                                    {
                                        league.fpts_against.toLocaleString("en-US")
                                    }
                                </td>
                                <td colSpan={1}>
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
                                            (league.rank_pts / league.total_rosters) <= .25 ? 'green' :
                                                (league.rank_pts / league.total_rosters) >= .75 ? 'red' :
                                                    null
                                        }
                                    >
                                        {
                                            league.rank_pts
                                        }
                                    </p>
                                </td>
                            </tr>
                        </tbody>
                    )
            }
        </table>
    </>
}

export default React.memo(Leagues_Owned);