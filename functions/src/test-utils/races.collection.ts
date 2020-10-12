export const races = [
  {
    url: 'https://en.wikipedia.org/wiki/2020_Austrian_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'gasly',
    name: 'Austrian Grand Prix',
    location: {
      country: 'Austria',
      lat: '47.2197',
      lng: '14.7647',
      nationality: 'Spielburg'
    },
    drivers: [
      'hamilton', 'bottas',
      'leclerc', 'vettel',
      'max_verstappen', 'albon',
      'sainz', 'norris',
      'ricciardo', 'hulkenberg',
      'gasly', 'kvyat',
      'perez', 'stroll',
      'raikkonen', 'giovinazzi',
      'kevin_magnussen', 'grosjean',
      'kubica', 'russell'
    ],
    raceStart: new Date(159395460000),
    season: 9999,
    countryCode: 'AT',
    open: new Date(159338160000),
    round: 4,
    close: new Date(159376680000)
  },
  {
    close: new Date(159134400000),
    url: 'https://en.wikipedia.org/wiki/2020_Azerbaijan_Grand_Prix',
    state: 'open',
    selectedDriver: 'max_verstappen',
    name: 'Azerbaijan Grand Prix',
    location: {
      lat: '40.3725',
      lng: '49.8533',
      nationality: 'Baku',
      country: 'Azerbaijan'
    },
    raceStart: new Date(159153180000),
    season: 9999,
    countryCode: 'AZ',
    open: new Date(159073920000),
    round: 1,
    drivers: [
      'hamilton',        'bottas',
      'leclerc',         'vettel',
      'max_verstappen',  'albon',
      'sainz',           'norris',
      'ricciardo',       'hulkenberg',
      'gasly',           'kvyat',
      'perez',           'stroll',
      'raikkonen',       'giovinazzi',
      'kevin_magnussen', 'grosjean',
      'kubica',          'russell'
    ]
  },
  {
    location: {
      lat: '50.4372',
      lng: '5.97139',
      nationality: 'Spa',
      country: 'Belgium'
    },
    raceStart: new Date(159879300000),
    season: 9999,
    countryCode: 'BE',
    open: new Date(159640560000),
    round: 7,
    drivers: [],
    close: new Date(159860520000),
    url: 'https://en.wikipedia.org/wiki/2020_Belgian_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'kevin_magnussen',
    name: 'Belgian Grand Prix'
  },
  {
    state: 'waiting',
    selectedDriver: 'hulkenberg',
    name: 'Brazilian Grand Prix',
    location: {
      nationality: 'São Paulo',
      country: 'Brazil',
      lat: '-23.7036',
      lng: '-46.6997'
    },
    raceStart: new Date(160546020000),
    season: 9999,
    countryCode: 'BR',
    open: new Date(160427160000),
    round: 14,
    drivers: [],
    close: new Date(160527240000),
    url: 'https://en.wikipedia.org/wiki/2020_Brazilian_Grand_Prix'
  },
  {
    close: new Date(159197040000),
    url: 'https://en.wikipedia.org/wiki/2020_Canadian_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'stroll',
    name: 'Canadian Grand Prix',
    location: {
      nationality: 'Montreal',
      country: 'Canada',
      lat: '45.5',
      lng: '-73.5228'
    },
    raceStart: new Date(159215820000),
    season: 9999,
    countryCode: 'CA',
    open: new Date(159156720000),
    round: 2,
  },
  {
    state: 'waiting',
    selectedDriver: 'gasly',
    name: 'French Grand Prix',
    location: {
      lat: '43.2506',
      lng: '5.79167',
      nationality: 'Le Castellet',
      country: 'France'
    },
    raceStart: new Date(159334980000),
    season: 9999,
    countryCode: 'FR',
    open: new Date(159217200000),
    round: 3,
    drivers: [],
    close: new Date(159316200000),
    url: 'https://en.wikipedia.org/wiki/2020_French_Grand_Prix'
  },
  {
    open: new Date(159519600000),
    round: 6,
    drivers: [],
    close: new Date(159618600000),
    url: 'https://en.wikipedia.org/wiki/2020_Hungarian_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'hulkenberg',
    name: 'Hungarian Grand Prix',
    location: {
      nationality: 'Budapest',
      country: 'Hungary',
      lat: '47.5789',
      lng: '19.2486'
    },
    raceStart: new Date(159637380000),
    season: 9999,
    countryCode: 'HU'
  },
  {
    raceStart: new Date(159939780000),
    season: 9999,
    countryCode: 'IT',
    open: new Date(159882480000),
    round: 8,
    drivers: [],
    close: new Date(159921000000),
    url: 'https://en.wikipedia.org/wiki/2020_Italian_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'giovinazzi',
    name: 'Italian Grand Prix',
    location: {
      lat: '45.6156',
      lng: '9.28111',
      nationality: 'Monza',
      country: 'Italy'
    }
  },
  {
    state: 'waiting',
    selectedDriver: 'kvyat',
    name: 'Japanese Grand Prix',
    location: {
      lat: '34.8431',
      lng: '136.541',
      nationality: 'Suzuka',
      country: 'Japan'
    },
    raceStart: new Date(160238940000),
    season: 9999,
    countryCode: 'JP',
    open: new Date(160124400000),
    round: 11,
    drivers: [],
    close: new Date(160220160000),
    url: 'https://en.wikipedia.org/wiki/2020_Japanese_Grand_Prix'
  },
  {
    close: new Date(160407000000),
    url: 'https://en.wikipedia.org/wiki/2020_Mexican_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'perez',
    name: 'Mexico City Grand Prix',
    location: {
      country: 'Mexico',
      lat: '19.4042',
      lng: '-99.0907',
      nationality: 'Mexico City'
    },
    raceStart: new Date(160425780000),
    season: 9999,
    countryCode: 'MX',
    open: new Date(160366680000),
    round: 13,
    drivers: []
  },
  {
    round: 10,
    drivers: [],
    close: new Date(160101720000),
    url: 'https://en.wikipedia.org/wiki/2020_Russian_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'kvyat',
    name: 'Russian Grand Prix',
    location: {
      country: 'Russia',
      lat: '43.4057',
      lng: '39.9578',
      nationality: 'Sochi'
    },
    raceStart: new Date(160120500000),
    season: 9999,
    countryCode: 'RU',
    open: new Date(160063920000)
  },
  {
    url: 'https://en.wikipedia.org/wiki/2020_Singapore_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'albon',
    name: 'Singapore Grand Prix',
    location: {
      country: 'Singapore',
      lat: '1.2914',
      lng: '103.864',
      nationality: 'Marina Bay'
    },
    raceStart: new Date(160060380000),
    season: 9999,
    countryCode: 'SG',
    open: new Date(159942960000),
    round: 9,
    drivers: [],
    close: new Date(160041600000)
  },
  {
    location: {
      country: 'UAE',
      lat: '24.4672',
      lng: '54.6031',
      nationality: 'Abu Dhabi'
    },
    raceStart: new Date(160665540000),
    season: 9999,
    countryCode: 'AE',
    open: new Date(160548120000),
    round: 15,
    drivers: [],
    close: new Date(160646760000),
    url: 'https://en.wikipedia.org/wiki/2020_Abu_Dhabi_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'kubica',
    name: 'Abu Dhabi Grand Prix'
  },
  {
    round: 5,
    drivers: [],
    close: new Date(159498000000),
    url: 'https://en.wikipedia.org/wiki/2020_British_Grand_Prix',
    state: 'waiting',
    selectedDriver: 'hamilton',
    name: 'British Grand Prix',
    location: {
      lat: '52.0786',
      lng: '-1.01694',
      nationality: 'Silverstone',
      country: 'UK'
    },
    raceStart: new Date(159516780000),
    season: 9999,
    countryCode: 'GB',
    open: new Date(159398640000)
  },
  {
    selectedDriver: 'vettel',
    name: 'United States Grand Prix',
    location: {
      nationality: 'Austin',
      country: 'USA',
      lat: '30.1328',
      lng: '-97.6411'
    },
    raceStart: new Date(160365300000),
    season: 9999,
    countryCode: 'US',
    open: new Date(160245360000),
    round: 12,
    drivers: [],
    close: new Date(160346160000),
    url: 'https://en.wikipedia.org/wiki/2020_United_States_Grand_Prix',
    state: 'waiting'
  }
]
