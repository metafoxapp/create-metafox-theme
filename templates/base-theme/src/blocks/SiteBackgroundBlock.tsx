/**
 * @type: siteDock
 * name: theme-flatten.block.SiteBackgroundBlock
 * title: Site Background Block
 * bundle: web
 * theme: flatten
 */
import { useTheme } from '@mui/material';
import React from 'react';

const SiteBackgroundBlock = () => {
  const theme = useTheme();
  const siteBackground = theme.siteBackground;

  React.useEffect(() => {
    document.body.style.background = siteBackground;
  }, [siteBackground]);
};

export default SiteBackgroundBlock;
