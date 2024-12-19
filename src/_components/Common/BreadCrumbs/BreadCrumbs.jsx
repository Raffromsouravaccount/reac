import React from 'react';
import Breadcrumbs from '@material-ui/core/Breadcrumbs';
import Typography from '@material-ui/core/Typography';
import Link from '@material-ui/core/Link';
import NavigateNextIcon from '@material-ui/icons/NavigateNext';

import { history } from '../../../_helpers/history';

const BreadcrumbsComp = ({ className, links, typography, ...props }) => {

  const handleRoute = route => history.push(route, { ...props });
  return (
    <div className={`bread-crumb top-minus-20 ${className}`}>
      <Breadcrumbs separator={<NavigateNextIcon fontSize="small" />}>
        {links?.map((link, index) => (
          <Link className = {`auto-breadCrum-${link?.text ? link?.text.split(" ").join("") : ""}`}key={index} color={link?.color} onClick={() => handleRoute(link?.route)}>{link?.text}</Link>
        ))}
        {typography?.map((data, index) => (
          <Typography key={index} color={data?.color}>{data?.text}</Typography>
        ))}
      </Breadcrumbs>
    </div>
  );
};

export default BreadcrumbsComp;
