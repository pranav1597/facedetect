import React from 'react';
import Tilty from 'react-tilty';
import brain from './brain.png';
import './Logo.css';

const Logo = () => {
	return (
		
	<div className='ma4 mt0'> 
		<Tilty className="Tilty br2 shadow-2" options={{ max : 55 }} 
		style={{ height: 100, width: 100 }} >
		 <div className="Tilty-inner"> <img alt='' src= {brain} /> </div>
		</Tilty>
		</div>
		
		);
}

export default Logo;

