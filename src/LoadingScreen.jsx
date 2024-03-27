import { useProgress, Html } from '@react-three/drei'

const LoadingScreen = ({started, onStarted}) => {
    const { progress } = useProgress()
    return (
        <div className='loadingScreen'>
            <div className='loadingBar' style={{width: `${progress}%`}}></div>
            <button 
                className='entry'
                disabled={progress < 100}
                onClick={onStarted}
            >
                Enter
            </button>
        </div>
    )
}

export default LoadingScreen