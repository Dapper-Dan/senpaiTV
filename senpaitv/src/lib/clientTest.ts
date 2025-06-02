import { getTrendingAnime } from './aniList';

getTrendingAnime()
  .then((data: any) => {
    console.log(JSON.stringify(data, null, 2));
  })
  .catch((err: any) => {
    console.error(err);
  });
  