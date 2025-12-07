import { Link } from 'react-router-dom';
import { gifts } from '../data/gifts';

export function HomePage() {
  return (
    <div className="page-shell-enhanced">
      <div className="reveal-card-enhanced" style={{ maxWidth: '480px' }}>
        <p className="eyebrow-enhanced">Eoin&apos;s Presents 🎁</p>
        <h1 className="title-enhanced" style={{ textAlign: 'center' }}>Welcome!</h1>
        <p className="subtitle-enhanced" style={{ textAlign: 'center', marginBottom: '24px' }}>
          If you have a personalised link, open it to reveal your surprise. Each link is crafted for
          a specific person and gift.
        </p>
        
        <div style={{ width: '100%', borderTop: '2px dashed #e2e8f0', margin: '20px 0', paddingTop: '20px' }}>
            <p className="subtitle-enhanced" style={{ fontSize: '0.9rem', marginBottom: '12px', textAlign: 'center' }}>
                Testing links for convenience:
            </p>
            <div className="link-grid">
            {gifts.map((gift) => (
                <Link key={gift.slug} className="chip" to={`/${gift.slug}`}>
                /{gift.slug}
                </Link>
            ))}
            </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
