import { BallTriangle } from 'react-loader-spinner';

export default function BallSpinner({
    height = 80, width = 80, color = '#BF4C20', label = "Loading-Assessment" }:
    { height?: number; width?: number; color?: string; label?: string }) {
    return (<BallTriangle
        height={height}
        width={width}
        radius={5}
        color={color}
        ariaLabel={label}
        wrapperStyle={{}}
        wrapperClass=""
        visible={true}
    />)

}