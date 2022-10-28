import React, { useState, useEffect } from "react";
const Roster = React.lazy(() => import('./roster'));

const LeagueRosters = (props) => {
    const [rosters, setRosters] = useState([]);
    const [activeRoster, setActiveRoster] = useState(0);

    useEffect(() => {
        setRosters(props.rosters.sort((a, b) =>
            b.settings.wins - a.settings.wins || b.settings.losses - a.settings.losses ||
            b.settings.fpts - a.settings.fpts
        ))
        setActiveRoster(props.rosters.find(x => x.owner_id === props.user_id || x.co_owners?.includes(props.user_id)))
    }, [props.rosters, props.user_id])

    const display = (
        rosters.map((roster, index) =>
            <tbody key={`${roster.roster_id}_${index}`}>
                <tr
                    className={activeRoster.roster_id === roster.roster_id ? `row${props.type} active clickable` : `row${props.type} clickable`}
                    onClick={() => setActiveRoster(roster)}
                >
                    <td colSpan={4} className={'left'}>
                        <p>
                            {
                                props.avatar(
                                    props.users.find(x => x.user_id === roster.owner_id)?.avatar,
                                    props.users.find(x => x.user_id === roster.owner_id)?.display_name,
                                    'user'
                                )
                            }
                            {props.users.find(x => x.user_id === roster.owner_id)?.display_name || 'Orphan'}
                            {roster.co_owners?.includes(props.user_id) ? '***' : null}
                        </p>
                    </td>
                    <td colSpan={2}>
                        {`${roster.settings.wins}-${roster.settings.losses}${roster.settings.ties > 0 ? roster.settings.ties : ''}`}
                    </td>
                    <td colSpan={3}>
                        {
                            `${roster.settings.fpts}.${roster.settings?.fpts_decimal}`
                        }
                    </td>
                    <td colSpan={3}>
                        {
                            `${roster.settings?.fpts_against}.${roster.settings?.fpts_against_decimal}`
                        }
                    </td>

                </tr>
            </tbody>
        )
    )


    return <>

        <table className={`table${props.type} league`}>
            <thead>
                <tr className={'single'}>
                    <th colSpan={4}>Manager</th>
                    <th colSpan={2}>Record</th>
                    <th colSpan={3}>PF</th>
                    <th colSpan={3}>PA</th>
                </tr>
            </thead>
            {display}
        </table>
        {
            activeRoster === 0 ? null :
                <React.Suspense fallback={
                    <div className='logo_wrapper'>
                        <div className='z one'>Z</div>
                        <div className='z two'>Z</div>
                        <div className='z three'>Z</div>
                    </div>
                }>
                    <Roster
                        type={props.type}
                        user={props.users.find(x => x.user_id === activeRoster.owner_id)}
                        users={props.users}
                        activeRoster={activeRoster}
                        roster_positions={props.roster_positions}
                        avatar={props.avatar}
                    />
                </React.Suspense>
        }
    </>
}

export default React.memo(LeagueRosters);