import React, { useEffect, useState } from "react"
import allplayers from '../allplayers.json'

const Roster = (props) => {
    const [activeRoster, setActiveRoster] = useState(props.activeRoster)
    const [tab, setTab] = useState('Starters')

    useEffect(() => {
        setActiveRoster(props.activeRoster)
    }, [props])

    const display = (
        tab === 'Starters' ?
            props.roster_positions.filter(x => x !== 'BN').map((slot, index) =>
                <tr key={`${slot}_${index}`} className="league_summary_content_row">
                    <td colSpan={1}>
                        {
                            slot.replace('SUPER_FLEX', 'SF')
                        }
                    </td>
                    <td colSpan={4} className={'left'}>

                        {
                            props.avatar(activeRoster.starters[index], allplayers[activeRoster.starters[index]]?.full_name, 'player')
                        }
                        <p>
                            {
                                activeRoster.starters[index] === '0' ?
                                    <em>{'Empty'}</em> :
                                    `${allplayers[activeRoster.starters[index]]?.position}
                                 ${allplayers[activeRoster.starters[index]]?.full_name}
                                 ${allplayers[activeRoster.starters[index]]?.team || 'FA'}
                                `
                                    || 'INACTIVE'
                            }
                        </p>
                    </td>
                </tr>
            )

            : tab === 'Bench' ?
                activeRoster.players.filter(x => !activeRoster.starters.includes(x) &&
                    !activeRoster?.taxi?.includes(x) && !activeRoster?.reserve?.includes(x)).map((player, index) =>
                        <tr key={`${player}_${index}`}>
                            <td colSpan={1}>
                                {
                                    props.avatar(player, allplayers[player]?.full_name, 'player')
                                }
                            </td>
                            <td colSpan={4} className="left">
                                <p>
                                    {
                                        `
                                                ${allplayers[player]?.position}
                                                ${allplayers[player]?.full_name}
                                                ${allplayers[player]?.team || 'FA'}
                                                `
                                    }
                                </p>
                            </td>
                        </tr>
                    )

                : tab === 'IR' ?
                    activeRoster.reserve?.map((player, index) =>
                        <tr key={`${player}_${index}`}>
                            <td colSpan={5} >
                                <span className="image">
                                    {
                                        props.avatar(player, allplayers[player]?.full_name, 'player')
                                    }
                                    <strong>
                                        {
                                            `
                                                ${allplayers[player]?.position}
                                                ${allplayers[player]?.full_name}
                                                ${allplayers[player]?.team || 'FA'}
                                                `
                                        }
                                    </strong>
                                </span>
                            </td>
                        </tr>
                    )

                    : tab === 'Taxi' ?
                        activeRoster.taxi?.map((player, index) =>
                            <tr key={`${player}_${index}`}>
                                <td colSpan={5} >
                                    <span className="image">
                                        {
                                            props.avatar(player, allplayers[player]?.full_name, 'player')
                                        }
                                        <strong>
                                            {
                                                `
                                                ${allplayers[player]?.position}
                                                ${allplayers[player]?.full_name}
                                                ${allplayers[player]?.team || 'FA'}
                                                `
                                            }
                                        </strong>
                                    </span>
                                </td>
                            </tr>
                        )
                        : null
    )

    return <>
        <table className={`table${props.type} roster`}>
            <thead>
                <tr className={'single'}>
                    <th colSpan={3} className="left">
                        <p>
                            {
                                props.avatar(props.user?.avatar, props.user?.display_name, 'user')
                            }
                            <span>
                                {props.user?.display_name}
                            </span>
                        </p>
                    </th>
                    <th colSpan={2} className={'small'}>
                        {activeRoster.co_owners?.map(co =>
                            <p key={co}>
                                {props.users.find(x => x.user_id === co)?.display_name}
                            </p>
                        )}
                    </th>
                </tr>
                <tr className={'double'}>
                    <th colSpan={5}>
                        <div className="button_wrapper">
                            <button
                                className={tab === 'Starters' ? 'active' : null}
                                onClick={() => setTab('Starters')}>
                                Starters
                            </button>
                            <button
                                className={tab === 'Bench' ? 'active' : null}
                                onClick={() => setTab('Bench')}
                            >
                                Bench
                            </button>
                            <button
                                className={tab === 'IR' ? 'active' : null}
                                onClick={() => setTab('IR')}
                            >
                                IR
                            </button>
                            <button
                                className={tab === 'Taxi' ? 'active' : null}
                                onClick={() => setTab('Taxi')}
                            >
                                Taxi
                            </button>
                        </div>
                    </th>
                </tr>
            </thead>
            <tbody>
                {display}
            </tbody>
        </table>
    </>
}

export default React.memo(Roster);