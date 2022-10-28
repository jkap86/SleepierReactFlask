import user_avatar from '../images/user_avatar.jpeg';
import league_avatar from '../images/league_avatar.png';
import player_avatar from '../images/headshot.png';

export const avatar = (avatar_id, alt, type) => {
    let source;
    let onError = null
    switch (type) {
        case 'league':
            source = avatar_id ? `https://sleepercdn.com/avatars/${avatar_id}` : league_avatar
            break;
        case 'user':
            source = avatar_id ? `https://sleepercdn.com/avatars/${avatar_id}` : user_avatar
            break;
        case 'player':
            source = `https://sleepercdn.com/content/nfl/players/thumb/${avatar_id}.jpg`
            onError = (e) => { return e.target.src = player_avatar }
            break;
        default:
            source = avatar_id ? `https://sleepercdn.com/avatars/${avatar_id}` : league_avatar
            break;
    }
    const image = <img
        alt={alt}
        src={source}
        onError={onError}
        className="thumbnail"
    />
    return image
}