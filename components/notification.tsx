import 'react-toastify/dist/ReactToastify.min.css';
import { toast, ToastContainer } from 'react-toastify';
import { Loader } from './balance';

export const NotificationDisplay = () => (
    <ToastContainer
        position="bottom-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
    />
)



export const successNotification = () => toast('Burn Successful 🔥🔥🔥', { type: 'success' });
export const errorNotification = (err: string) => toast(`Burn Failed... ${err}`, { type: 'error' });
export const metamaskSubmittedNotification = () => toast('Transaction approved on Metamask! 🦊')
export const infoNotification = () => toast(
    <div className='flex justify-between w-full items-center'>
        <p>Burn Request in Progress...</p>
        <Loader />
    </div>,
    {
        type: 'info',
        autoClose: 10_000,
    }
);