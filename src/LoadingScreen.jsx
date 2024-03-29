import { useProgress, Html } from '@react-three/drei'

const LoadingScreen = ({started, onStarted}) => {

    const { progress } = useProgress()
    return (
        <Html center>
            <div className='loadingScreen'>
                <div className='loadingBar' style={{width: `${progress}%`}}></div>
                <button 
                    className='entryButton'
                    disabled={progress < 100}
                    onClick={onStarted}
                >
                    Enter
                </button>
            </div>
        </Html>
    )
}

export default LoadingScreen