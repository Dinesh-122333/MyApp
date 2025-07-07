import ImageKit from 'imagekit-javascript';

const urlEndpoint = process.env.EXPO_PUBLIC_IMAGEKIT_URL || '';
const publicKey = process.env.EXPO_PUBLIC_IMAGEKIT_KEY;



const imagekit = new ImageKit({
    urlEndpoint,
    publicKey,

});

export const getImagekitUrlFromPath = function (imagePath: String, transformationArray: any[]) {
  const ikOptions = {
    urlEndpoint,
    path: imagePath,
    transformation: transformationArray,
  };
//   if (transformationPostion)
//     ikOptions.transformationPostion = transformationPostion;

//   const imageURL = imagekit.url(ikOptions);

  return imageURL;
};