// src/components/Coverage/LeafletFallback.jsx
const LeafletFallback = () => (
    <div className="h-125 flex flex-col items-center justify-center bg-base-200 rounded-lg">
        <FaGlobeAsia className="text-6xl text-primary/50 mb-4" />
        <h3 className="text-xl font-bold mb-2">Interactive Map Loading</h3>
        <p className="text-base-content/70 mb-4">Please make sure Leaflet CSS and JS are loaded</p>
        <div className="text-sm">
            <p>If map doesn't load, check that these are in your HTML:</p>
            <code className="block bg-base-300 p-2 rounded mt-2 text-xs">
                &lt;link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" /&gt;
            </code>
        </div>
    </div>
);

export default LeafletFallback;