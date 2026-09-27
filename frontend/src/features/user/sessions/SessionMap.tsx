import { AdvancedMarker, APIProvider, Map } from '@vis.gl/react-google-maps'

interface SessionMapProps {
  latitude: number
  longitude: number
}

export default function SessionMap({ latitude, longitude }: SessionMapProps) {
  const center = { lat: latitude, lng: longitude }

  return (
    <APIProvider apiKey={process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY as string}>
      <Map
        className='h-[300px] w-full overflow-hidden rounded-md'
        defaultCenter={center}
        defaultZoom={10}
        mapId={process.env.NEXT_PUBLIC_GOOGLE_MAPS_MAP_ID ?? 'DEMO_MAP_ID'}
        disableDefaultUI
        zoomControl
      >
        <AdvancedMarker position={center} />
      </Map>
    </APIProvider>
  )
}
