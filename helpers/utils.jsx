

export function debounce(func, wait, immediate) {
  let timeout;

  return function () {
    const context = this, args = arguments;
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;

    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}


let defaultText = "malesuada fames ac turpis egestas integer eget aliquet nibh praesent tristique magna sit amet purus gravida quis blandit turpis cursus in hac habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus mauris a diam maecenas sed enim ut sem viverra aliquet eget sit amet tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt dui ut ornare lectus sit amet est placerat in egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam eget felis eget nunc lobortis mattis aliquam faucibus purus in massa tempor nec feugiat nisl pretium fusce id velit ut tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius duis at consectetur lorem donec massa sapien faucibus et molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt malesuada fames ac turpis egestas integer eget aliquet nibh praesent tristique magna sit amet purus gravida quis blandit turpis cursus in hac habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus mauris a diam maecenas sed enim ut sem viverra aliquet eget sit amet tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt dui ut ornare lectus sit amet est placerat in egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam eget felis eget nunc lobortis mattis aliquam faucibus purus in massa tempor nec feugiat nisl pretium fusce id velit ut tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius duis at consectetur lorem donec massa sapien faucibus et molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt malesuada fames ac turpis egestas integer eget aliquet nibh praesent tristique magna sit amet purus gravida quis blandit turpis cursus in hac habitasse platea dictumst quisque sagittis purus sit amet volutpat consequat mauris nunc congue nisi vitae suscipit tellus mauris a diam maecenas sed enim ut sem viverra aliquet eget sit amet tellus cras adipiscing enim eu turpis egestas pretium aenean pharetra magna ac placerat vestibulum lectus mauris ultrices eros in cursus turpis massa tincidunt dui ut ornare lectus sit amet est placerat in egestas erat imperdiet sed euismod nisi porta lorem mollis aliquam ut porttitor leo a diam sollicitudin tempor id eu nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper sit amet risus nullam eget felis eget nunc lobortis mattis aliquam faucibus purus in massa tempor nec feugiat nisl pretium fusce id velit ut tortor pretium viverra suspendisse potenti nullam ac tortor vitae purus faucibus ornare suspendisse sed nisi lacus sed viverra tellus in hac habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at augue eget arcu dictum varius duis at consectetur lorem donec massa sapien faucibus et molestie ac feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi tincidunt"
export const defaultWords = [
  {
    "text": "Transferred",
    "start": 0,
    "end": 378,
    "confidence": 0.92688,
    "speaker": null
  },
  {
    "text": "in",
    "start": 394,
    "end": 478,
    "confidence": 0.998,
    "speaker": null
  },
  {
    "text": "any",
    "start": 484,
    "end": 654,
    "confidence": 0.54263,
    "speaker": null
  },
  {
    "text": "way,",
    "start": 692,
    "end": 846,
    "confidence": 0.99998,
    "speaker": null
  },
  {
    "text": "then",
    "start": 868,
    "end": 1006,
    "confidence": 0.98202,
    "speaker": null
  },
  {
    "text": "it",
    "start": 1028,
    "end": 1118,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "would",
    "start": 1124,
    "end": 1246,
    "confidence": 0.98933,
    "speaker": null
  },
  {
    "text": "just",
    "start": 1268,
    "end": 1406,
    "confidence": 0.99995,
    "speaker": null
  },
  {
    "text": "be",
    "start": 1428,
    "end": 1566,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "insanity",
    "start": 1588,
    "end": 2394,
    "confidence": 0.9985,
    "speaker": null
  },
  {
    "text": "for",
    "start": 2522,
    "end": 2766,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "me",
    "start": 2788,
    "end": 2926,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "to",
    "start": 2948,
    "end": 3086,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "spend",
    "start": 3108,
    "end": 3294,
    "confidence": 0.99997,
    "speaker": null
  },
  {
    "text": "any",
    "start": 3332,
    "end": 3534,
    "confidence": 0.99995,
    "speaker": null
  },
  {
    "text": "time",
    "start": 3572,
    "end": 3918,
    "confidence": 0.99885,
    "speaker": null
  },
  {
    "text": "doing",
    "start": 4004,
    "end": 4350,
    "confidence": 0.81757,
    "speaker": null
  },
  {
    "text": "something",
    "start": 4420,
    "end": 4990,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "that",
    "start": 5140,
    "end": 5406,
    "confidence": 0.99989,
    "speaker": null
  },
  {
    "text": "I",
    "start": 5428,
    "end": 5566,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "didn't",
    "start": 5588,
    "end": 5786,
    "confidence": 0.99974,
    "speaker": null
  },
  {
    "text": "like",
    "start": 5818,
    "end": 6062,
    "confidence": 0.99992,
    "speaker": null
  },
  {
    "text": "or",
    "start": 6116,
    "end": 6334,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "being",
    "start": 6372,
    "end": 6574,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "with",
    "start": 6612,
    "end": 6766,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "someone",
    "start": 6788,
    "end": 7022,
    "confidence": 0.99998,
    "speaker": null
  },
  {
    "text": "that",
    "start": 7076,
    "end": 7198,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "I",
    "start": 7204,
    "end": 7326,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "didn't",
    "start": 7348,
    "end": 7546,
    "confidence": 0.99996,
    "speaker": null
  },
  {
    "text": "like.",
    "start": 7578,
    "end": 7966,
    "confidence": 0.99998,
    "speaker": null
  },
  {
    "text": "So",
    "start": 8068,
    "end": 8382,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "I",
    "start": 8436,
    "end": 8606,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "quickly",
    "start": 8628,
    "end": 8910,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "didn't.",
    "start": 8980,
    "end": 9354,
    "confidence": 0.99995,
    "speaker": null
  },
  {
    "text": "So",
    "start": 9402,
    "end": 9662,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "everyone",
    "start": 9716,
    "end": 10126,
    "confidence": 0.99955,
    "speaker": null
  },
  {
    "text": "I'm",
    "start": 10228,
    "end": 10746,
    "confidence": 0.9678,
    "speaker": null
  },
  {
    "text": "with,",
    "start": 10858,
    "end": 11326,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "I",
    "start": 11428,
    "end": 11742,
    "confidence": 0.66,
    "speaker": null
  },
  {
    "text": "literally",
    "start": 11796,
    "end": 12298,
    "confidence": 0.99934,
    "speaker": null
  },
  {
    "text": "love,",
    "start": 12394,
    "end": 12894,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "and",
    "start": 13012,
    "end": 13438,
    "confidence": 0.59,
    "speaker": null
  },
  {
    "text": "everything",
    "start": 13524,
    "end": 14110,
    "confidence": 0.98709,
    "speaker": null
  },
  {
    "text": "I",
    "start": 14260,
    "end": 14526,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "do",
    "start": 14548,
    "end": 14734,
    "confidence": 0.60387,
    "speaker": null
  },
  {
    "text": "with",
    "start": 14772,
    "end": 14974,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "them,",
    "start": 15012,
    "end": 15310,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "I",
    "start": 15380,
    "end": 15662,
    "confidence": 0.94,
    "speaker": null
  },
  {
    "text": "love.",
    "start": 15716,
    "end": 16414,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "And",
    "start": 16612,
    "end": 17166,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "that",
    "start": 17268,
    "end": 17534,
    "confidence": 0.99517,
    "speaker": null
  },
  {
    "text": "was",
    "start": 17572,
    "end": 17726,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "a",
    "start": 17748,
    "end": 17934,
    "confidence": 0.99,
    "speaker": null
  },
  {
    "text": "great",
    "start": 17972,
    "end": 18222,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "filter",
    "start": 18276,
    "end": 18634,
    "confidence": 0.99215,
    "speaker": null
  },
  {
    "text": "for",
    "start": 18682,
    "end": 18846,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "me.",
    "start": 18868,
    "end": 19440,
    "confidence": 0.9983,
    "speaker": null
  },
  {
    "text": "It",
    "start": 21010,
    "end": 21470,
    "confidence": 0.92412,
    "speaker": null
  },
  {
    "text": "cut",
    "start": 21540,
    "end": 21822,
    "confidence": 0.64423,
    "speaker": null
  },
  {
    "text": "the",
    "start": 21876,
    "end": 21998,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "wheat",
    "start": 22004,
    "end": 22218,
    "confidence": 0.89615,
    "speaker": null
  },
  {
    "text": "from",
    "start": 22234,
    "end": 22366,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "the",
    "start": 22388,
    "end": 22478,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "chaff",
    "start": 22484,
    "end": 22794,
    "confidence": 0.92792,
    "speaker": null
  },
  {
    "text": "very",
    "start": 22842,
    "end": 23102,
    "confidence": 0.99998,
    "speaker": null
  },
  {
    "text": "quickly",
    "start": 23156,
    "end": 23758,
    "confidence": 0.99998,
    "speaker": null
  },
  {
    "text": "and",
    "start": 23924,
    "end": 24710,
    "confidence": 0.99,
    "speaker": null
  },
  {
    "text": "think",
    "start": 24900,
    "end": 25254,
    "confidence": 0.99811,
    "speaker": null
  },
  {
    "text": "that",
    "start": 25292,
    "end": 25542,
    "confidence": 0.99989,
    "speaker": null
  },
  {
    "text": "comes",
    "start": 25596,
    "end": 25862,
    "confidence": 0.99995,
    "speaker": null
  },
  {
    "text": "through.",
    "start": 25916,
    "end": 26230,
    "confidence": 0.99294,
    "speaker": null
  },
  {
    "text": "I",
    "start": 26300,
    "end": 26438,
    "confidence": 0.99,
    "speaker": null
  },
  {
    "text": "mean,",
    "start": 26444,
    "end": 26566,
    "confidence": 0.99938,
    "speaker": null
  },
  {
    "text": "I'm",
    "start": 26588,
    "end": 26882,
    "confidence": 0.63286,
    "speaker": null
  },
  {
    "text": "very",
    "start": 26946,
    "end": 27222,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "close",
    "start": 27276,
    "end": 27590,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "friends",
    "start": 27660,
    "end": 28278,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "with",
    "start": 28444,
    "end": 28870,
    "confidence": 0.99998,
    "speaker": null
  },
  {
    "text": "everybody",
    "start": 28940,
    "end": 29366,
    "confidence": 0.99932,
    "speaker": null
  },
  {
    "text": "that",
    "start": 29468,
    "end": 29686,
    "confidence": 0.99984,
    "speaker": null
  },
  {
    "text": "I",
    "start": 29708,
    "end": 29846,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "coach",
    "start": 29868,
    "end": 30386,
    "confidence": 0.99976,
    "speaker": null
  },
  {
    "text": "or",
    "start": 30498,
    "end": 30774,
    "confidence": 0.99869,
    "speaker": null
  },
  {
    "text": "have",
    "start": 30812,
    "end": 31062,
    "confidence": 0.99954,
    "speaker": null
  },
  {
    "text": "coached.",
    "start": 31116,
    "end": 31910,
    "confidence": 0.89741,
    "speaker": null
  },
  {
    "text": "And",
    "start": 32410,
    "end": 32966,
    "confidence": 0.97,
    "speaker": null
  },
  {
    "text": "they",
    "start": 33068,
    "end": 33334,
    "confidence": 0.99956,
    "speaker": null
  },
  {
    "text": "come",
    "start": 33372,
    "end": 33526,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "to",
    "start": 33548,
    "end": 33686,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "Kauai",
    "start": 33708,
    "end": 34114,
    "confidence": 0.55619,
    "speaker": null
  },
  {
    "text": "and",
    "start": 34162,
    "end": 34326,
    "confidence": 0.82,
    "speaker": null
  },
  {
    "text": "I",
    "start": 34348,
    "end": 34486,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "go",
    "start": 34508,
    "end": 34694,
    "confidence": 0.98656,
    "speaker": null
  },
  {
    "text": "visit",
    "start": 34732,
    "end": 35026,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "them",
    "start": 35058,
    "end": 35302,
    "confidence": 0.99982,
    "speaker": null
  },
  {
    "text": "and",
    "start": 35356,
    "end": 35574,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "stay",
    "start": 35612,
    "end": 35766,
    "confidence": 0.99985,
    "speaker": null
  },
  {
    "text": "at",
    "start": 35788,
    "end": 35926,
    "confidence": 0.73,
    "speaker": null
  },
  {
    "text": "their",
    "start": 35948,
    "end": 36086,
    "confidence": 0.99969,
    "speaker": null
  },
  {
    "text": "house.",
    "start": 36108,
    "end": 36294,
    "confidence": 0.58787,
    "speaker": null
  },
  {
    "text": "I",
    "start": 36332,
    "end": 36438,
    "confidence": 0.84,
    "speaker": null
  },
  {
    "text": "mean,",
    "start": 36444,
    "end": 37000,
    "confidence": 0.99781,
    "speaker": null
  },
  {
    "text": "we're",
    "start": 37530,
    "end": 37906,
    "confidence": 0.99914,
    "speaker": null
  },
  {
    "text": "friends.",
    "start": 37938,
    "end": 38520,
    "confidence": 0.59,
    "speaker": null
  },
  {
    "text": "And",
    "start": 38970,
    "end": 39286,
    "confidence": 0.98,
    "speaker": null
  },
  {
    "text": "that's",
    "start": 39308,
    "end": 39458,
    "confidence": 0.99994,
    "speaker": null
  },
  {
    "text": "really",
    "start": 39474,
    "end": 39606,
    "confidence": 0.99993,
    "speaker": null
  },
  {
    "text": "why",
    "start": 39628,
    "end": 39766,
    "confidence": 0.99994,
    "speaker": null
  },
  {
    "text": "I",
    "start": 39788,
    "end": 39926,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "did",
    "start": 39948,
    "end": 40086,
    "confidence": 0.99993,
    "speaker": null
  },
  {
    "text": "this,",
    "start": 40108,
    "end": 40342,
    "confidence": 0.99993,
    "speaker": null
  },
  {
    "text": "because",
    "start": 40396,
    "end": 40710,
    "confidence": 0.97491,
    "speaker": null
  },
  {
    "text": "I",
    "start": 40780,
    "end": 41062,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "love",
    "start": 41116,
    "end": 41334,
    "confidence": 0.99997,
    "speaker": null
  },
  {
    "text": "that",
    "start": 41372,
    "end": 41574,
    "confidence": 0.99925,
    "speaker": null
  },
  {
    "text": "connection.",
    "start": 41612,
    "end": 42450,
    "confidence": 0.99981,
    "speaker": null
  },
  {
    "text": "And",
    "start": 42610,
    "end": 42934,
    "confidence": 0.99,
    "speaker": null
  },
  {
    "text": "they're",
    "start": 42972,
    "end": 43138,
    "confidence": 0.99896,
    "speaker": null
  },
  {
    "text": "also",
    "start": 43154,
    "end": 43334,
    "confidence": 0.9986,
    "speaker": null
  },
  {
    "text": "really",
    "start": 43372,
    "end": 43574,
    "confidence": 0.99991,
    "speaker": null
  },
  {
    "text": "interesting",
    "start": 43612,
    "end": 43910,
    "confidence": 0.99995,
    "speaker": null
  },
  {
    "text": "people.",
    "start": 43980,
    "end": 44214,
    "confidence": 0.97593,
    "speaker": null
  },
  {
    "text": "So",
    "start": 44252,
    "end": 44454,
    "confidence": 0.95075,
    "speaker": null
  },
  {
    "text": "really",
    "start": 44492,
    "end": 44694,
    "confidence": 0.96669,
    "speaker": null
  },
  {
    "text": "fun",
    "start": 44732,
    "end": 44934,
    "confidence": 0.99999,
    "speaker": null
  },
  {
    "text": "to",
    "start": 44972,
    "end": 45078,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "be",
    "start": 45084,
    "end": 45206,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "friends",
    "start": 45228,
    "end": 45462,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "with.",
    "start": 45516,
    "end": 46070,
    "confidence": 0.99974,
    "speaker": null
  },
  {
    "text": "So",
    "start": 46220,
    "end": 46486,
    "confidence": 0.99521,
    "speaker": null
  },
  {
    "text": "that's",
    "start": 46508,
    "end": 46786,
    "confidence": 0.99942,
    "speaker": null
  },
  {
    "text": "one",
    "start": 46818,
    "end": 46966,
    "confidence": 1,
    "speaker": null
  },
  {
    "text": "L.",
    "start": 46988,
    "end": 47060,
    "confidence": 0.96,
    "speaker": null
  }
]
export const defaultVideos = [
  {"id": "f1b05ca6-f7d3-4974-9059-a168e6942974", "status": "loaded", "loading": false, "url": "https://influencer-edits.s3.amazonaws.com/videos/small.mp4", "name": "small.mp4", "thumbnail": "https://influencer-edits.s3.amazonaws.com/thumbnails/small.png"}
]