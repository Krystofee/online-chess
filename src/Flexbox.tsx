import React from 'react';

type Props = {
  direction?: 'column' | 'column-reverse' | 'row' | 'row-reverse';
  wrap?: 'wrap' | 'nowrap' | 'wrap-reverse';
  justifyContent?: 'center' | 'flex-start' | 'flex-end' | 'space-around' | 'space-between';
  alignItems?: 'center' | 'flex-start' | 'flex-end' | 'stretch' | 'baseline';
  alignContent?: 'center' | 'flex-start' | 'flex-end' | 'space-around' | 'space-between';
  id?: string;
  className?: string;
  style?: React.CSSProperties;
  children: React.ReactNode;
};

const Flexbox = ({
  id,
  className,
  direction,
  wrap,
  justifyContent,
  alignItems,
  alignContent,
  style = {},
  children,
}: Props) => (
  <div
    id={id}
    className={className}
    style={{
      display: 'flex',
      flexDirection: direction,
      flexWrap: wrap,
      justifyContent,
      alignItems,
      alignContent,
      ...style,
    }}
  >
    {children}
  </div>
);

export default Flexbox;
