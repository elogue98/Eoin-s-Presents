import { motion } from 'framer-motion';
import type { Gift } from '../data/gifts';

type GiftVoucherProps = {
  gift: Gift;
};

const cardVariants = {
  hidden: { opacity: 0, y: 50 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.6, 
      ease: "easeOut",
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { duration: 0.4 }
  }
};

export function GiftVoucher({ gift }: GiftVoucherProps) {
  const isChristmas = gift.isChristmas;

  return (
    <motion.article 
      className={`voucher-card ${isChristmas ? 'christmas-theme' : ''}`}
      variants={cardVariants}
      initial="hidden"
      animate="visible"
    >
      <div className="voucher-hero">
        <img src={gift.heroImage} alt={gift.title} />
        {isChristmas && (
            <div className="christmas-badge">
                🎄 Merry Christmas, {gift.recipientName}! 🎅
            </div>
        )}
      </div>

      <div className="voucher-body">
        <div className="voucher-header">
           {isChristmas && <p className="eyebrow christmas-eyebrow">A Special Christmas Gift</p>}
          <h1>{gift.title}</h1>
          {gift.subtitle && <p className="voucher-subtitle">{gift.subtitle}</p>}
          <p className="voucher-intro">{gift.intro}</p>
        </div>

        <section className="voucher-section">
          <div className="section-title">
            <span className="section-icon" aria-hidden="true">
              {isChristmas ? '🎁' : '🧗'}
            </span>
            <h2>{gift.whatsIncludedTitle}</h2>
          </div>
          <ul className="voucher-list">
            {gift.whatsIncludedItems.map((item, index) => (
              <motion.li 
                key={index}
                variants={itemVariants}
                dangerouslySetInnerHTML={{ __html: item }}
              />
            ))}
          </ul>
        </section>

        {gift.extraSectionTitle && gift.extraSectionItems && (
          <section className="voucher-section">
            <div className="section-title">
              <span className="section-icon" aria-hidden="true">
                📅
              </span>
              <h2>{gift.extraSectionTitle}</h2>
            </div>
            <ul className="voucher-list">
              {gift.extraSectionItems.map((item, index) => (
                <motion.li 
                  key={index}
                  variants={itemVariants}
                >
                  {item}
                </motion.li>
              ))}
            </ul>
          </section>
        )}

        <footer className="voucher-footer">
          {/* Message link removed for Conor/Christmas as requested */}
          {!isChristmas && (
            <a className="primary-link" href="mailto:eoin@example.com?subject=Let%27s%20plan%20your%20climbing%20day">
                Message Eoin to plan it
            </a>
          )}
          {isChristmas && (
              <p className="christmas-footer-msg">
                  Have a wonderful Christmas! We'll plan the details in the New Year.
              </p>
          )}
        </footer>
      </div>
    </motion.article>
  );
}

export default GiftVoucher;
