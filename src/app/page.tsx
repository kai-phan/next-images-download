'use client';

import { useState } from 'react';
import { fetchImage } from 'src/actions';

const CONSTANTS = {
  'PS0-TC2001-WHT': [
    '/front/designLineVersion/v1/regular.jpg',
    '/lifestyle-poster-1/designLineVersion/v1/regular.jpg',
    '/lifestyle-poster-2/designLineVersion/v1/regular.jpg',
    '/lifestyle-poster-3/designLineVersion/v1/regular.jpg',
  ],
  'PS1-TC2001-WHT': [
    '/front/designLineVersion/v1/regular.jpg',
    '/lifestyle-poster-1/designLineVersion/v1/regular.jpg',
    '/lifestyle-poster-2/designLineVersion/v1/regular.jpg',
    '/lifestyle-poster-3/designLineVersion/v1/regular.jpg',
  ],
  'S3CWP10-CG124-WHT': [
    '/aos-canvas-pgw-16x24-lifestyle-front-16/designLineVersion/v1/regular.jpg',
    '/aos-canvas-pgw-16x24-lifestyle-front-17/designLineVersion/v1/regular.jpg',
    '/aos-canvas-pgw-16x24-lifestyle-front-18/designLineVersion/v1/regular.jpg',
  ],
  'S3CWP11-CG124-WHT': [
    '/aos-canvas-pgw-16x24-lifestyle-front-16/designLineVersion/v1/regular.jpg',
    '/aos-canvas-pgw-16x24-lifestyle-front-17/designLineVersion/v1/regular.jpg',
    '/aos-canvas-pgw-16x24-lifestyle-front-18/designLineVersion/v1/regular.jpg',
  ],
  'PLM0-TC2004-WHT': [
    '/front/designLineVersion/v1/regular.jpg',
    '/poster-landscape-24x16-lifestyle-01/designLineVersion/v1/regular.jpg',
    '/poster-landscape-24x16-lifestyle-22/designLineVersion/v1/regular.jpg',
    '/poster-landscape-24x16-lifestyle-24/designLineVersion/v1/regular.jpg',
  ],
  'PLM1-TC2004-WHT': [
    '/front/designLineVersion/v1/regular.jpg',
    '/poster-landscape-24x16-lifestyle-01/designLineVersion/v1/regular.jpg',
    '/poster-landscape-24x16-lifestyle-22/designLineVersion/v1/regular.jpg',
    '/poster-landscape-24x16-lifestyle-24/designLineVersion/v1/regular.jpg',
  ],
  'S3CWP20-CG125-WHT': [
    '/aos-canvas-pgw-24x16-lifestyle-front-16/designLineVersion/v1/regular.jpg',
    '/aos-canvas-pgw-24x16-lifestyle-front-17/designLineVersion/v1/regular.jpg',
    '/aos-canvas-pgw-24x16-lifestyle-front-18/designLineVersion/v1/regular.jpg',
  ],
  'S3CWP21-CG125-WHT': [
    '/aos-canvas-pgw-24x16-lifestyle-front-16/designLineVersion/v1/regular.jpg',
    '/aos-canvas-pgw-24x16-lifestyle-front-17/designLineVersion/v1/regular.jpg',
    '/aos-canvas-pgw-24x16-lifestyle-front-18/designLineVersion/v1/regular.jpg',
  ],
};

const DOWNLOAD_LINK =
  'https://cdn.32pt.com/public/sl-prod-od-0/images/retail-products';

const getDownloadLinkSuffix = (
  accCode?: string | null,
  productCode?: string | null,
) => {
  return (
    accCode &&
    productCode &&
    `${DOWNLOAD_LINK}/${accCode}/${accCode}-${productCode}-`
  );
};

const getImagePrefix = () => {
  return Object.entries(CONSTANTS).reduce((acc, [key, value]) => {
    const prefixs = value.map((item) => `${key}${item}`);
    return acc.concat(...prefixs);
  }, [] as string[]);
};

export default function Page() {
  const [link, setLink] = useState('');
  const [loading, setLoading] = useState(false);

  const getLinkId = () => {
    try {
      const url = new URL(link);
      const retailProductCode = url.searchParams.get('retailProductCode');

      return {
        accCode: retailProductCode && retailProductCode.split('-')[0],
        productCode: retailProductCode && retailProductCode.split('-')[1],
      };
    } catch (error) {
      return {
        retailProductCode: '',
        productCode: '',
      };
    }
  };

  const suffix = getDownloadLinkSuffix(
    getLinkId().accCode,
    getLinkId().productCode,
  );

  return (
    <div className="container mx-auto py-6">
      <div
        style={{
          display: 'flex',
        }}
      >
        <input
          className={'border p-2'}
          style={{ flex: 1 }}
          value={link}
          onChange={(e) => setLink(e.target.value)}
        />
        <button
          className={'border p-2 ml-2'}
          disabled={loading}
          onClick={async () => {
            setLoading(true);

            const urls = getImagePrefix().map((prefix) => `${suffix}${prefix}`);

            let images = await Promise.all(urls.map(fetchImage));

            images = images.filter((image) => image !== null) as {
              url: string;
              type: string;
              name: string;
            }[];

            for (let i = 0; i < images.length; i++) {
              const a = document.createElement('a');

              a.href = images[i]?.url!;
              a.download = images[i]?.name!;

              document.body.appendChild(a);
              a.click();
              document.body.removeChild(a);
            }

            setLoading(false);
          }}
        >
          {loading ? 'Downloading...' : 'Download'}
        </button>
      </div>

      <br />
      <ul>
        <li>
          <p>
            <strong>Acc:</strong> {getLinkId().accCode}
          </p>
        </li>
        <li>
          <p>
            <strong>Product:</strong> {getLinkId().productCode}
          </p>
        </li>
      </ul>
      <br />

      <ul className="grid grid-cols-4">
        {suffix &&
          getImagePrefix().map((prefix) => {
            return (
              <li key={prefix}>
                <a href={`${suffix}${prefix}`} target="_blank" rel="noreferrer">
                  <img src={`${suffix}${prefix}`} />
                </a>
              </li>
            );
          })}
      </ul>
    </div>
  );
}
