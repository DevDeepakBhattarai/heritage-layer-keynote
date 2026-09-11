import hero from "../assets/hero-courtyard.webp";
import { PRODUCT_NAME } from "../presentation";

/** Static closing slide. No beats, no motion beyond the deck's own slide transition. */
export function ClosingScene() {
  return (
    <div className="closing">
      <img className="photo" src={hero} alt="" />
      <div className="closing-shade" />
      <div className="closing-copy">
        <h1 className="display">Thank you.</h1>
        <i className="closing-rule" aria-hidden="true" />
        <p className="lead muted">Questions welcome.</p>
        <p className="closing-brand">{PRODUCT_NAME}</p>
      </div>
    </div>
  );
}
