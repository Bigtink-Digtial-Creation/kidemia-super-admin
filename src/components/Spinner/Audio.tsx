import { Audio } from 'react-loader-spinner';
export default function AudioSpinner() {
    return (
        <Audio
            height="80"
            width="80"
            color="#BF4C20"
            ariaLabel="audio-loading"
            wrapperStyle={{}}
            wrapperClass="wrapper-class"
            visible={true}
        />
    )
}