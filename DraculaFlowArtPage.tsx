// DraculaFlowArtPage.tsx
import type { NextPage } from 'next';
import Head from 'next/head';
import styles from './DraculaFlowArtPage.module.css';

const DraculaFlowArtPage: NextPage = () => {
    return (
        <div className={styles.container}>
            <Head>
                <title>Dracula Flow Art Page</title>
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            </Head>
            <div className={styles.content}>
                <h1 className={styles.title}>Dracula Flow: Visual Art Piece</h1>
                <img
                    src="/An_abstract,_ethereal_art_piece_reflecting_the_emo.png"
                    alt="Dracula Flow Art Piece"
                    className={styles.image}
                />
                <p className={styles.description}>
                    This art piece blends gothic aesthetics with a Bloodborne-inspired surrealism, capturing the emotional and narrative complexity of the described scene. The doll-like figure represents resilience amidst chaos, surrounded by a haunting yet beautiful environment.
                </p>
                <p className={styles.description}>
                    For more creative demos, visit the repo or connect with Sora.{' '}
                    <a href="#" className={styles.link}>
                        Explore More
                    </a>
                </p>
            </div>
        </div>
    );
};

export default DraculaFlowArtPage;

/* DraculaFlowArtPage.module.css */
.container {
    margin: 0;
    font-family: Arial, sans-serif;
    background-color: #1e1e2f;
    color: #f5f5f5;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 100vh;
}

.content {
    text-align: center;
    max-width: 800px;
}

.title {
    font-size: 2.5rem;
    margin-bottom: 1rem;
    color: #ff79c6;
}

.image {
    max-width: 100%;
    border: 5px solid #5a5a7c;
    border-radius: 8px;
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.5);
}

.description {
    font-size: 1.2rem;
    line-height: 1.6;
}

.link {
    color: #8be9fd;
    text-decoration: none;
    border-bottom: 1px dashed #8be9fd;
}

.link:hover {
    border-bottom: 1px solid #8be9fd;
}
