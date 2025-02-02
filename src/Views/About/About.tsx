
export default function About() {
    return (
        <div className="bg-white w-screen h-screen flex flex-col items-center justify-start text-pink-300 p-4">
            <div className="w-full h-[80%] my-auto flex justify-center items-center bg-cover bg-center"
                style={{ backgroundImage: 'url(images/background2.png)' }}>
                <div className="w-[95%] h-[90vh] bg-[#272727] bg-opacity-90 rounded-md p-8 flex flex-col justify-center items-center gap-2">
                    <h1 className="text-[4rem] font-bold">Erin Dawn Campbell</h1>
                    <p className="text-white text-[1rem] leading-2">~</p>
                    <p className="text-white text-lg">I love playing dress up.</p>
                    <p className="text-white text-2xl">Especially when I get to make the dress.</p>
                    <p className="text-white text-3xl">Even more when I am
                        <span className="text-green-300"> saving that dress from the landfill.</span></p>
                <p className="text-white mt-8">For more information on my process or to get in touch reach out at <a className="text-blue-400" href="mailto:erin.d.campbell@gmail.com" target="_blank">erin.d.campbell@gmail.com</a></p>
                </div>
            </div>
        </div>
    )
}