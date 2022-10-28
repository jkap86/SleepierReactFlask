import allplayers from '../allplayers.json';
import { useState } from "react";

const LineupBreakdown = ({ type, roster, lineup_check, avatar, weekly_rankings }) => {
    const [activeSlot, setActiveSlot] = useState(null)

    const display = lineup_check.map((slot, index) =>
        <tbody key={`${slot.cur_id}_${index}`}>
            <tr
                className={
                    activeSlot?.slot === slot.slot && activeSlot?.index === index ?
                        `row${type} active clickable` : `row${type} clickable`
                }
                onClick={() => setActiveSlot(prevState => slot === prevState ? null : slot)}
            >
                <td colSpan={1}
                    className={slot.subs.length > 0 ? 'sub' : null}
                >
                    {slot.slot}
                </td>
                <td colSpan={3} className={'left'}>
                    <p>
                        {
                            avatar(slot.cur_id, allplayers[slot.cur_id]?.full_name, 'player')
                        }
                        {allplayers[slot.cur_id]?.full_name}
                    </p>
                </td>
                <td>
                    {slot.cur_rank}
                </td>
                <td>
                    {slot.cur_pos_rank}
                </td>
            </tr>
        </tbody>
    )

    const subs = activeSlot ? activeSlot.subs : roster.players

    return <>
        <table className={`table${type} lineup`}>
            <thead>
                <tr className={'single'}>
                    <th colSpan={1}>Slot</th>
                    <th colSpan={3}>Starter</th>
                    <th colSpan={1}>Rank</th>
                    <th colSpan={1}>Pos Rank</th>
                </tr>
            </thead>
            {display}
        </table>
        <table className={`table${type} subs`}>
            <tbody>
                {
                    subs
                        .filter(p => !roster.starters.includes(p))
                        .sort((a, b) => (weekly_rankings.find(w_r => w_r.id === a)?.rank_ecr || 999) -
                            (weekly_rankings.find(w_r => w_r.id === b)?.rank_ecr || 999))
                        .map((bp, index) =>
                            <tr
                                key={`${bp}_${index}`}
                            >
                                <td colSpan={1}>
                                    {allplayers[bp]?.position}
                                </td>
                                <td colSpan={5} className={'left'}>
                                    <p>
                                        {
                                            avatar(bp, allplayers[bp]?.full_name, 'player')
                                        }
                                        {allplayers[bp]?.full_name}
                                    </p>
                                </td>
                                <td colSpan={1}>
                                    {weekly_rankings.find(w_r => w_r.id === bp)?.rank_ecr || '-'}
                                </td>
                                <td colSpan={2}>
                                    {weekly_rankings.find(w_r => w_r.id === bp)?.pos_rank || '-'}
                                </td>
                            </tr>
                        )
                }
            </tbody>
        </table>
    </>
}

export default LineupBreakdown;