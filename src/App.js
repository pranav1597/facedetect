import React, {Component} from 'react';
import Particles from 'react-particles-js';
import Navigation from './components/Navigation/Navigation';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';
import Logo from './components/Logo/Logo';
import Rank from './components/Rank/Rank';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import './App.css';


const particlesOption = {
                      particles: {
                        line_linked: {
                          shadow: {
                            enable: true,
                            color:'#00dbde',
                            blur: 5,

                         }
                        },
                            number: {
                              value: 80,
                                density: {
                                  enable: true,
                                  value_area: 700
                            }
                          }
                      }


                  }

const initialState = {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignedIn: false,
      user: {
        id: '',
      name: '',
      email: '',
      entries: 0,
      joined: ''
      }
    }

class App extends Component {

  constructor()
  {
    super();
    this.state = initialState;
  }

loadUser = (data) => {
  this.setState({user: {
    id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
  }})
}
  

  calculateFaceLocation = (data) => {
   const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;
   const image = document.getElementById('inputimage');
   const width = Number(image.width);
   const height = Number(image.height);
   // console.log(clarifaiFace);
   // console.log(width, height);
    return {
        leftCol: clarifaiFace.left_col * width,
        topRow: clarifaiFace.top_row * height,
        rightCol: width - (clarifaiFace.right_col * width),
        bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayBox = (box) => {
    console.log(box);
    this.setState({box: box});
  }

  onInputChange = (event) => {
    this.setState({input: event.target.value});

  } 

  onSubmitButton = () => {
    this.setState({imageUrl: this.state.input})
      fetch('https://tranquil-lowlands-36575.herokuapp.com/profile/imageurl', {
            method: 'post',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              input: this.state.input
      })
          })
      .then(response => response.json())
      .then(response => {
        if(response) {
          fetch('https://tranquil-lowlands-36575.herokuapp.com/profile/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
      })
          })
          .then(response => response.json())
          .then(count => {
            this.setState(Object.assign(this.state.user ,{entries:count}))
            })
          .catch(err => console.log('count problem'));
         
        }
        this.displayBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log('unable to connect'));

  }


 

  onRouteChange = (route) => {
    if(route === 'signout') {
      this.setState(initialState)
    } else {
      this.setState({isSignedIn: true})
    }
    this.setState({route: route});
  }

  render() {
    return (
      <div className="App">
      <div className='title'> Face Detector </div>
      <Particles className='particles' 
                params={particlesOption} />
       <Navigation isSignedIn={this.state.isSignedIn} onRouteChange={this.onRouteChange}/> {
        this.state.route === 'home'
          ?
          <div>
            <Logo />
            <Rank
              name={this.state.user.name}
              entries={this.state.user.entries}
              />
            <ImageLinkForm 
              onInputChange={this.onInputChange} 
              onSubmitButton={this.onSubmitButton}
              />
             <FaceRecognition box={this.state.box} imageUrl={this.state.imageUrl} />
          </div>
          : (
            this.state.route === 'signin' 
            ?
            <Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            :
            <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
       
    }
     
      </div>
    );
  }
}

export default App;
