declare module 'lucide-react' {
  import * as React from 'react';
  
  export interface IconProps extends React.SVGAttributes<SVGElement> {
    color?: string;
    size?: string | number;
  }
  
  export type Icon = React.FC<IconProps>;
  
  export const ArrowRight: Icon;
  export const ExternalLink: Icon;
  export const Github: Icon;
  export const Star: Icon;
  export const Mail: Icon;
  export const MapPin: Icon;
  export const Phone: Icon;
  export const Send: Icon;
  export const Heart: Icon;
  export const Menu: Icon;
  export const X: Icon;
  export const Home: Icon;
  export const Briefcase: Icon;
  export const User: Icon;
  export const Code: Icon;
  // Add any other icons used in your project
} 