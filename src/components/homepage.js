import { Link } from 'react-router-dom';
import { useState } from 'react';
import sleeperLogo from '../images/sleeper_icon.png';

const Homepage = () => {
    const [username, setUsername] = useState('')

    return <div id='homepage'>
        <div className='home_wrapper'>
            <h1>
                <p className="image">
                    <img
                        alt='sleeper_logo'
                        className='home'
                        src={sleeperLogo}
                    />
                    <strong>
                        Sleepier
                    </strong>
                </p>
            </h1>
            <div className="username_search_wrapper">
                <input
                    className='home'
                    type="text"
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Link to={`/${username}`}>
                    <button
                        className='home clickable'
                    >
                        Submit
                    </button>
                </Link>
            </div>
        </div>
    </div>
}

export default Homepage;