
import react, {Component} from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation';
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import Rank from './components/Rank/Rank';
import { Fragment } from 'react/cjs/react.production.min';
import Particles from "react-tsparticles";
import FaceRecogntion from './components/FaceRecognition/FaceRecognition'
import SignIn from './components/SignIn/SignIn';
import Register from './components/Register/Register';



const intialState = {
    input: '',
    imageUrl: '',
    box: {
    },
    route: 'signin',
    isSignedIn: false,
    user: {
      id: '',
      name: '',
      password: '',
      email: '',
      entries: 0,
      joined: ''
    }
}

class App extends Component {
  constructor(){
    super()
    this.state = intialState
}
//backend test
// componentDidMount(){
//   fetch('http://localhost:3001/')
//   .then(response => response.json())
//   .then(console.log)
// }
loadUser =(data)=>{
this.setState({ user:
  {
    id: data.id,
    name: data.name,
    password: data.password,
    email: data.email,
    entries: data.entries,
    joined: data.joined
}})
}
calculateFaceLocation = (data)  => {
  const clarifaFace = data.outputs[0].data.regions[0].region_info.bounding_box;
  const image = document.getElementById('inputImage');
  const width = Number(image.width);
  const height = Number(image.height);
  return {
    leftCol: clarifaFace.left_col * width,
    topRow: clarifaFace.top_row * height,
    rightCol: width - (clarifaFace.right_col * width),
    bottomRow: height - (clarifaFace.bottom_row * height)
  }
}


displayFaceBox = (box) => {

  this.setState({box: box})
}
onInputChange = (event) =>{
  this.setState({input: event.target.value})
}

onButtonSubmit = () => {
  //  console.log('click')
  this.setState({imageUrl: this.state.input})
  // send the input to the imageurl that will do the clarifai call
  fetch('https://obscure-forest-18294.herokuapp.com/imageurl', {
    method: 'post',
    headers: {'content-Type': 'application/json'},
    body: JSON.stringify({
      input: this.state.input
    })
  })
  // get json from server and then make another fetch to the imageurl
  .then(response => response.json())
  .then(response => {
    if (response){
      fetch('https://obscure-forest-18294.herokuapp.com/image', {
        method: 'put',
        headers: {'content-Type': 'application/json'},
        body: JSON.stringify({
          id: this.state.user.id
      })
    })
    .then(response => response.json())
    .then(count => {
      this.setState(Object.assign(this.state.user,{ entries:count }))
    })
    .catch(console.log);
    }
     this.displayFaceBox(this.calculateFaceLocation(response))
    })
      // console.log(response.outputs[0].data.regions[0].region_info.bounding_box)
  .catch(err => console.log(err));
}

onRouteChange = (route) => {
  if (route === 'signout'){
    this.setState(intialState)
  }
  else if (route === 'home'){
    this.setState({isSignedIn: true})
  }
  this.setState({route: route});
}
  render() {
   const {isSignedIn, imageUrl, route, box} = this.state
    return (
  <Fragment>
    <div className="App">
    <Particles 
        options={{

          fpsLimit: 60,
          interactivity: {
            events: {
              onClick: {
                enable: false,
                mode: "push",
              },
              onHover: {
                enable: false,
                mode: "repulse",
              },
              resize: true,
            },
            modes: {
              bubble: {
                distance: 400,
                duration: 2,
                opacity: 0.8,
                size: 40,
              },
              push: {
                quantity: 4,
              },
              repulse: {
                distance: 200,
                duration: 0.4,
              },
            },
          },
          particles: {
            color: {
              value: "#B5F629",
            },
            links: {
              color: "#4B6612",
              distance: 150,
              enable: true,
              opacity: 0.5,
              width: 1,
            },
            collisions: {
              enable: false,
            },
            move: {
              direction: "none",
              enable: true,
              outMode: "bounce",
              random: false,
              speed: 2,
              straight: false,
            },
            number: {
              density: {
                enable: true,
                area: 800,
              },
              value: 80,
            },
            opacity: {
              value: 0.5,
            },
            shape: {
              type: "circle",
            },
            size: {
              random: true,
              value: 5,
            },
          },
          detectRetina: true,
        }}/>
      <Navigation isSignedIn={isSignedIn} onRouteChange={this.onRouteChange}/>
      
      { route === 'home' 
       ?<div>
       <Logo />
       <Rank name={this.state.user.name} entries={this.state.user.entries}/>
      <ImageLinkForm  onInputChange={this.onInputChange} onButtonSubmit={this.onButtonSubmit}/>
       <FaceRecogntion box={box} imageUrl={imageUrl}/>
       </div> 
      :( 
        route === 'signin'
      ?<SignIn loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
      : <Register loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
        )
       
      }
    </div>
    </Fragment>
  );
}
}
export default App;
