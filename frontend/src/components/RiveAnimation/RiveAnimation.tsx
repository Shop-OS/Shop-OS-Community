// @refresh reset
import { Alignment, Fit, Layout, useRive } from '@rive-app/react-canvas';

import './styles.css';

export const RiveDemo = () => {
  let { RiveComponent } = useRive({
    src: 'hom_logo_1.riv',
    stateMachines: 'State Machine 1',
    layout: new Layout({
      fit: Fit.FitWidth, // Change to: rive.Fit.Contain, or Cover
      alignment: Alignment.Center,
    }),
    autoplay: true,
  });

  return <RiveComponent />;
};

// Another example loading a Rive file from a URL
export const UrlDemo = () => {
  const { rive, RiveComponent } = useRive({
    src: 'https://cdn.rive.app/animations/vehicles.riv',
    autoplay: true,
  });
  return <RiveComponent />;
};

export default function RiveAnimation() {
  return (
    <div className="RiveContainer">
      <RiveDemo />
    </div>
  );
}
