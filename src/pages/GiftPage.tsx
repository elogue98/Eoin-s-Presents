import { useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import GiftReveal from '../components/GiftReveal';
import GiftVoucher from '../components/GiftVoucher';
import { getGiftBySlug } from '../data/gifts';

export function GiftPage() {
  const { slug } = useParams<{ slug: string }>();
  const gift = useMemo(() => (slug ? getGiftBySlug(slug) : undefined), [slug]);
  const [isRevealed, setIsRevealed] = useState(false);

  if (!gift) {
    return (
      <div className="page page--not-found">
        <div className="content-card">
          <p className="eyebrow">No such present</p>
          <h1>That link does not match a gift</h1>
          <p className="muted">Double-check the URL, or head back to the main page.</p>
          <Link className="primary-link" to="/">
            Back to home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={`page-shell-enhanced ${isRevealed ? 'revealed' : ''} ${gift.isChristmas ? 'christmas-mode' : ''}`}
    >
      {/* Snow effect container for Christmas mode */}
      {gift.isChristmas && <div className="snow-container" aria-hidden="true" />}
      
      <AnimatePresence mode="wait">
        {!isRevealed ? (
          <motion.div
            key="reveal"
            className="reveal-layer"
            exit={{ opacity: 0, y: -50, transition: { duration: 0.5 } }}
          >
            <GiftReveal gift={gift} onComplete={() => setIsRevealed(true)} />
          </motion.div>
        ) : (
          <motion.div
            key="voucher"
            className="voucher-section-enhanced"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, type: "spring", bounce: 0.3 }}
          >
            <GiftVoucher gift={gift} />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default GiftPage;
