import { parseISO, format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { GetStaticPaths, GetStaticProps } from 'next';
import  Head from 'next/head';
import Image from 'next/image';
import { api } from '../../services/api';
import Link from 'next/link';
import { convertDurationToTimeString } from '../../utils/convertDurationToTimeString';
import styles from './episode.module.scss';
import { useContext } from 'react';
import { PlayerContext, usePlayer } from '../../contexts/PlayerContexts';
import { episodesConst } from '../../utils/mockedData';

type Episode = {
  id: string;
  title: string;
  thumbnail: string;
  members: string;
  publishedAt: string;
  duration: number;
  durationAsString: string;
  description: string;
  url: string;
}

type EpisodeProps = {
    episode: Episode;
}

export default function Episode({ episode }: EpisodeProps) {
    const { play } = usePlayer();

    return (
        <div className={styles.episode}>
            <Head>
                <title>{episode.title} | Podcastr</title>
            </Head>

            <div className={styles.thumbnailContainer}>
                <button type="button">
                    <Link href="/">
                        <img src="/arrow-left.svg" alt="Voltar"/>
                    </Link>
                </button>
                <Image 
                    width={700}
                    height={160}
                    src={episode.thumbnail}
                    objectFit="cover"
                />
                <button type="button" onClick={() => play(episode)}>
                    <img src="/play.svg" alt="Tocar episódio"/>
                </button>
            </div>

            <header>
                <h1>{episode.title}</h1>
                <span>{episode.members}</span>
                <span>{episode.publishedAt}</span>
                <span>{episode.durationAsString}</span>
            </header>

            <div className={styles.description} dangerouslySetInnerHTML={{__html: episode.description}} />
        </div>
    );
}

export const getStaticPaths: GetStaticPaths = async () => {
    return{
        paths: [],
        fallback: 'blocking'
    }
}

export const getStaticProps: GetStaticProps = async (ctx) => {
    const { slug } = ctx.params;    
    const data = episodesConst.filter(e => e.id === slug)[0];
    
    const episode = {
        id: data.id,
          title: data.title,
          thumbnail: data.thumbnail,
          members: data.members,
          publishedAt: format(parseISO(data.published_at), 'd MMM yy', { locale: ptBR }),
          duration: Number(data.file.duration),
          durationAsString: convertDurationToTimeString(Number(data.file.duration)),
          description: data.description,
          url: data.file.url
    }
    
    return {
        props: {
            episode
        },
        revalidate: 60 * 60 * 24 //24 Horas
    };
}