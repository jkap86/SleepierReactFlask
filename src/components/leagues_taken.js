import React, { useState } from "react";

const Leagues_Taken = ({ leagues_taken, type, avatar }) => {
    const [rostersVisible, setRostersVisible] = useState([]);

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
                <tr className={`single`}>
                    <th colSpan={4}>League</th>
                    <th colSpan={3}>Manager</th>
                    <th colSpan={3}>Status</th>
                    <th colSpan={2} className="small">
                        Rank (Ovr)
                    </th>
                    <th colSpan={2} className="small">
                        Rank (PF)
                    </th>
                </tr>
            </thead>
            {
                leagues_taken?.map((league, index) =>
                    <tbody key={`${league.league_id}_${index}`}>
                        <tr
                            className={rostersVisible.includes(league.league_id) ? `row${type} active` : `row${type}`}
                            onClick={() => toggleRosters(league.league_id)}
                        >
                            <td colSpan={4} className={'left'}>
                                <p>
                                    {
                                        avatar(league.league_avatar, league.league_name, 'league')
                                    }
                                    {league.league_name}
                                </p>
                            </td>
                            <td colSpan={3} className="left">
                                <p>
                                    {
                                        avatar(league.manager.avatar, league.manager.display_name, 'user')
                                    }
                                    {league.manager.display_name}
                                </p>
                            </td>
                            <td colSpan={3}>
                                {league.status}
                            </td>
                            <td colSpan={2}>
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
                            <td colSpan={2}>
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

export default React.memo(Leagues_Taken);