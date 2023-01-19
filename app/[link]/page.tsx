import CardPageLegacy from './legacy';

type CardPageParams = {
  params: {
    link: string,
  }
}

export default function CardPage({ params }: CardPageParams) {
  // retreive id and secret from url
  let [id, secret] = [params.link.substring(0, 8), params.link.substring(8, 16)];

  return <CardPageLegacy id={id} secret={secret} />
}