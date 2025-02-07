import { MapComponent } from '@/components/map/Map';

export default function Home() {
  return (
    <main className="min-h-screen p-4">
      <div className="max-w-[1920px] mx-auto">
        <h1 className="text-3xl font-bold mb-4">Interactive Map</h1>
        <MapComponent />
      </div>
    </main>
  );
}