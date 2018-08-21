const src = `const YellowSquare = () => (
	<fill-rect color="yellow"/>
)

Cute.attach(
	<YellowSquare w={75} h={75} x={25} y={25}/>,
	document.querySelector('.cute-app'),
	300,
	400
)
`

const compiled = Babel.transform(src, {
	presets: ['es2015'],
	plugins: [[
		'transform-react-jsx', {
			'pragma': 'Cute.createElement',
		},
	],
	'transform-object-rest-spread',
	],
}).code

eval(compiled)
