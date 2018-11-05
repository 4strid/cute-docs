const input = `
timestep 1 body 0 x 177.179 y 88.258316 x-velocity 0.57693857 y-velocity -6.78807E-5 net force x 0.28846928 net force y -3.394035E-5
timestep 1 body 1 x 795.0586 y 103.995735 x-velocity 4.2632113 y-velocity -1.5290414 net force x 2.1316056 net force y -0.7645207
timestep 1 body 2 x 943.3753 y 55.25471 x-velocity -4.84015 y-velocity 1.5291092 net force x -2.420075 net force y 0.7645546
timestep 2 body 0 x 178.9089 y 88.25731 x-velocity 1.1529686 y-velocity -9.381968E-4 net force x 0.28801507 net force y -4.3515803E-4
timestep 2 body 1 x 808.4384 y 99.219 x-velocity 9.116617 y-velocity -3.2476897 net force x 2.4267032 net force y -0.8593241
timestep 2 body 2 x 928.26556 y 60.032448 x-velocity -10.269587 y-velocity 3.2486277 net force x -2.7147183 net force y 0.8597593
timestep 3 body 0 x 181.7887 y 88.25236 x-velocity 1.7268252 y-velocity -0.00401043 net force x 0.28692827 net force y -0.0015361167
timestep 3 body 1 x 834.3171 y 90.107414 x-velocity 16.762043 y-velocity -5.8638973 net force x 3.8227131 net force y -1.3081039
timestep 3 body 2 x 899.5071 y 69.14899 x-velocity -18.488869 y-velocity 5.8679075 net force x -4.1096416 net force y 1.30964
timestep 4 body 0 x 185.81468 y 88.238335 x-velocity 2.299156 y-velocity -0.010008978 net force x 0.2861654 net force y -0.0029992738
timestep 4 body 1 x 894.62823 y 69.66597 x-velocity 43.549103 y-velocity -14.577546 net force x 13.393529 net force y -4.3568244
timestep 4 body 2 x 835.1699 y 89.60445 x-velocity -45.84826 y-velocity 14.587555 net force x -13.679694 net force y 4.3598237
timestep 5 body 0 x 190.99495 y 88.21203 x-velocity 2.881113 y-velocity -0.0162971 net force x 0.29097858 net force y -0.0031440614
timestep 5 body 1 x 949.2822 y 51.308533 x-velocity 11.104862 y-velocity -3.779889 net force x -16.22212 net force y 5.3988285
timestep 5 body 2 x 775.3357 y 107.98819 x-velocity -13.985975 y-velocity 3.7961855 net force x 15.931142 net force y -5.3956847
`

const src = `
/*
 * STICK YR DATA HERE
 */
const input = \`${(console.log(input), input)}\`

const Square = Cute({
	render() {
		return (
			<path>
				<rect w={this.w} h={this.h}>
					<fill color={this.props.color} />
				</rect>
			</path>
		)
	},
})


function randomColor () {
	const hex = Math.min(Math.floor(Math.random() * (0xffffff) * 1.4), 0xffffff).toString(16)
	return '#' + '0'.repeat(6 - hex.length) + hex
}

function parseInput (str) {
	const bodies = [];
	/*
     * CHANGE COLORS HERE
     */
	const colors = ['hotpink', 'cyan', 'plum', 'red', 'chartreuse', 'orange'];
	const lines = str.trim().split('\\n');
	lines.forEach(line => {
		const match = line.match(/^timestep .+ body (.+) x (.+) y (.+) x-velocity.*$/);
		const [_, bodyId, xAsStr, yAsStr] = match;
		const x = Number(xAsStr);
		const y = Number(yAsStr);
		colors[bodyId] = tinycolor(colors[bodyId]).darken(5).toString();
		bodies.push({ bodyId, x, y, color: colors[bodyId] });
	});
	return { bodies };
}

const App = Cute({
	render() {
		const { bodies, colors, scale, offset } = this.data;
		console.log(bodies);
		return (
			<layer>
				{ this.data.bodies.map(({ x, y, color }) => <Square color={color} x={x} y={y} w={12} h={12} />) }
			</layer>
		)
	},
	data() {
		return parseInput(input);
	}
})

Cute.attach(
	<App />,
	document.querySelector('.cute-app'),
	1000,
	1000
)
`

const editor = document.querySelector('.src pre code')
editor.innerText = src
editor.addEventListener('input', compile)
editor.addEventListener('keydown', insertTab)
editor.contentEditable = true

let app = null

compile({target: { innerText: src }})

function insertTab (evt) {
	console.log(evt)
	if (evt.key === 'Tab') {
		evt.preventDefault()
		document.execCommand('insertHTML', false, '&#009')
	}
	return false
}

function compile (evt) {
	const src = evt.target.innerText

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

	document.querySelector('.cute-app').innerHTML = ''

	app = eval(compiled)
}
