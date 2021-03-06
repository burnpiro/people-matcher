import React from "react";
import PropTypes from "prop-types";
import Helmet from "react-helmet";

function Seo({ description, lang, meta, title }) {
  const siteMeta = {
    author: "@burnpiro"
  };

  return (
    <Helmet
      htmlAttributes={{
        lang
      }}
      title={title}
      titleTemplate={`%s | People Matcher`}
      meta={[
        {
          name: `viewport`,
          content: `minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no`
        },
        {
          property: `og:title`,
          content: title
        },
        {
          property: `og:type`,
          content: `website`
        },
        {
          name: `twitter:card`,
          content: `summary`
        },
        {
          name: `twitter:creator`,
          content: siteMeta.author
        },
        {
          name: `twitter:title`,
          content: title
        }
      ].concat(meta)}
    />
  );
}

Seo.defaultProps = {
  lang: `en`,
  meta: [],
  description: ``
};

Seo.propTypes = {
  description: PropTypes.string,
  lang: PropTypes.string,
  meta: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string.isRequired
};

export default Seo;
