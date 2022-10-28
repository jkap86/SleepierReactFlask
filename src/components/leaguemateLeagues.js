import React, { useState, useEffect } from "react";
import LeagueRosters from "./leagueRosters";

const LeaguemateLeagues = (props) => {
    const [leagues, setLeagues] = useState([])
    const [rostersVisible, setRostersVisible] = useState([])

    const toggleRosters = (league_id) => {
        let rv = rostersVisible;
        if (rv.includes(league_id)) {
            rv = rv.filter(x => x !== league_id)
        } else {
            rv.push(league_id)
        }
        setRostersVisible([...rv])
    }


    useEffect(() => {
        setLeagues(props.leagues)
    }, [props])

    const display = (
        leagues.map((league, index) =>
            <tbody
                key={`${league.league_id}_${index}`}
            >
                <tr
                    className={rostersVisible.includes(league.league_id) ? `row${props.type} active` : `row${props.type}`}
                    onClick={() => toggleRosters(league.league_id)}
                >
                    <td colSpan={4} className={'left'}>
                        <p>
                            {
                                props.avatar(league.avatar, league.name, 'league')
                            }
                            {league.name}
                        </p>
                    </td>
                    <td colSpan={2}>
                        {league.lmroster.settings.wins}-{league.lmroster.settings.losses}
                    </td>
                    <td colSpan={2}>
                        <em>
                            {
                                ((league.lmroster.settings.wins) /
                                    (league.lmroster.settings.wins + league.lmroster.settings.losses)).toLocaleString("en-US", {
                                        maximumFractionDigits: 4,
                                        minimumFractionDigits: 4
                                    })
                            }
                        </em>
                    </td>
                    <td colSpan={2}>
                        {league.roster.settings.wins}-{league.roster.settings.losses}
                    </td>
                    <td colSpan={2}>
                        <em>
                            {
                                ((league.roster.settings.wins) /
                                    (league.roster.settings.wins + league.roster.settings.losses)).toLocaleString("en-US", { maximumFractionDigits: 4, minimumFractionDigits: 4 })
                            }
                        </em>
                    </td>
                </tr>
            </tbody>
        )

    )

    return <>
        <div className={`nav${props.type}`}></div>
        <table className={`table${props.type}`}>
            <thead className={`header${props.type}`}>
                <tr className={`header${props.type} double`}>
                    <th rowSpan={4} colSpan={4}>League</th>
                    <th colSpan={4}>{props.leaguemate}</th>
                    <th colSpan={4}>{props.username}</th>
                </tr>
                <tr className={`header${props.type} double`}>
                    <th colSpan={2}>Record</th>
                    <th colSpan={2}>Wpct</th>
                    <th colSpan={2}>Record</th>
                    <th colSpan={2}>Wpct</th>
                </tr>
            </thead>
            {display}
        </table>
    </>
}

export default React.memo(LeaguemateLeagues);