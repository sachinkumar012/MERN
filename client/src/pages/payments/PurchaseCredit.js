import { useDispatch, useSelector } from "react-redux";
import { CREDIT_PACKS, PLAN_IDS, pricingList } from "../../config/payments";
import { useState } from "react";
import axios from "axios";
import { serverEndpoint } from "../../config/config";
import { SET_USER } from "../../redux/user/actions";
import './PurchaseCredit.css';
import { Modal } from "react-bootstrap";

function PurchaseCredit() {
    const dispatch = useDispatch();
    const userDetails = useSelector((state) => state.userDetails);
    const [errors, setErrors] = useState({});
    const [message, setMessage] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const handleBuyCredits = async (credits) => {
        setShowModal(false);
        try {
            const { data } = await axios.post(`${serverEndpoint}/payments/create-order`, {
                credits
            }, { withCredentials: true });

            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                amount: data.order.amount,
                currency: data.order.currency,
                name: 'Affiliate++',
                description: `${credits} Credits Pack`,
                order_id: data.order.id,
                handler: async (response) => {
                    try {
                        const { data } = await axios.post(`${serverEndpoint}/payments/verify-order`, {
                            razorpay_order_id: response.razorpay_order_id,
                            razorpay_payment_id: response.razorpay_payment_id,
                            razorpay_signature: response.razorpay_signature,
                            credits
                        }, { withCredentials: true });

                        dispatch({
                            type: SET_USER,
                            payload: data
                        });
                        setMessage(`${credits} credits added!`);
                    } catch (error) {
                        console.error(error);
                        setErrors({ message: 'Unable to purchase credits, please try again' });
                    }
                },
                theme: { color: '#3399cc' }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            setErrors({ message: 'Unable to purchase credits, please try again' });
        }
    };

    const handleSubscribe = async (planKey) => {
        try {
            const { data } = await axios.post(`${serverEndpoint}/payments/create-subscription`, {
                plan_name: planKey
            }, { withCredentials: true });

            const plan = PLAN_IDS[planKey];
            const options = {
                key: process.env.REACT_APP_RAZORPAY_KEY_ID,
                name: plan.planName,
                description: plan.description,
                subscription_id: data.subscription.id,
                handler: async function (response) {
                    try {
                        const user = await axios.post(`${serverEndpoint}/payments/verify-subscription`, {
                            subscription_id: response.razorpay_subscription_id
                        }, { withCredentials: true });

                        dispatch({
                            type: SET_USER,
                            payload: user.data
                        });
                        setMessage('Subscription activated');
                    } catch (error) {
                        setErrors({ message: 'Unable to activate subscription, please try again' });
                    }
                },
                theme: { color: "#3399cc" }
            };

            const rzp = new window.Razorpay(options);
            rzp.open();
        } catch (error) {
            console.error(error);
            setErrors({ message: 'Failed to create subscription' });
        }
    };

    return (
        <section className="purchase-section">
            <div className="purchase-header-row">
                <div>
                    <h3>Choose Plan</h3>
                    <p className="purchase-subheading">
                        Flexible options: one-time credits or recurring subscriptions.
                    </p>
                </div>
                <div className="purchase-balance">
                    <h3>Current Balance</h3>
                    <p className="purchase-subheading">
                        {userDetails.credits} Credits
                    </p>
                </div>
            </div>

            {errors.message && <div className="form-error">{errors.message}</div>}
            {message && <div className="form-success">{message}</div>}

            <div className="purchase-cards-row">
                {/* Credit Pack Card */}
                <div className="card purchase-card">
                    <div className="purchase-card-title">Credit Packs</div>
                    <ul className="purchase-list">
                        {CREDIT_PACKS.map(c => (
                            <li key={c}>{c} CREDITS FOR ₹{c}</li>
                        ))}
                    </ul>
                    <button className="btn-primary full-width" onClick={() => setShowModal(true)}>
                        Buy Credits
                    </button>
                </div>

                {/* Monthly Plan */}
                <div className="card purchase-card">
                    <div className="purchase-card-title">₹199/month</div>
                    <ul className="purchase-list">
                        {pricingList[1].list.map((item, i) => (
                            <li key={i}>{item.detail}</li>
                        ))}
                    </ul>
                    <button className="btn-primary full-width" onClick={() => handleSubscribe('UNLIMITED_MONTHLY')}>
                        Subscribe Monthly
                    </button>
                </div>

                {/* Yearly Plan */}
                <div className="card purchase-card">
                    <div className="purchase-card-title">₹1990/year</div>
                    <ul className="purchase-list">
                        {pricingList[2].list.map((item, i) => (
                            <li key={i}>{item.detail}</li>
                        ))}
                    </ul>
                    <button className="btn-primary full-width" onClick={() => handleSubscribe('UNLIMITED_YEARLY')}>
                        Subscribe Yearly
                    </button>
                </div>
            </div>

            {/* Modal for buying credits */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Buy Credits</Modal.Title>
                </Modal.Header>
                <Modal.Body className="purchase-modal-body">
                    {CREDIT_PACKS.map((c) => (
                        <button
                            key={c}
                            className="btn-primary m-2"
                            onClick={() => handleBuyCredits(c)}
                        >
                            Buy {c} Credits
                        </button>
                    ))}
                </Modal.Body>
            </Modal>
        </section>
    );
}

export default PurchaseCredit;
