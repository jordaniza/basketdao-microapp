const Button: React.FC<React.ButtonHTMLAttributes<HTMLButtonElement>> = (props) => (
    <button
        className="
        disabled:bg-gray-400
        disabled:text-gray-200
        disabled:border-gray-400
        disabled:shadow-none
        px-4 py-2
        text-lg
        rounded-md shadow-md 
        text-white
        hover:bg-white border-2 border-primary-dark hover:text-primary-dark
        transition-all delay-75 bg-primary-dark text-white'"
        {...props}
    >
        {props.children}
    </button>
)

export default Button