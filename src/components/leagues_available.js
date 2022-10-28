import React, { useState } from "react";

const Leagues_Available = ({ leagues_available, type, avatar }) => {
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
                    <th colSpan={1}>League</th>
                </tr>
            </thead>
            {
                leagues_available?.map((league, index) =>
                    <tbody
                        key={`${league.league_id}_${index}`}
                    >
                        <tr
                            className={rostersVisible.includes(league.league_id) ? `row${type} active` : `row${type}`}
                        >
                            <td colSpan={1} className={'left'}>
                                <p onClick={() => toggleRosters(league.league_id)}>
                                    {
                                        avatar(league.avatar, league.name, 'league')
                                    }
                                    {league.name}
                                </p>
                            </td>
                        </tr>

                    </tbody>
                )
            }
        </table>
    </>
}

export default React.memo(Leagues_Available);