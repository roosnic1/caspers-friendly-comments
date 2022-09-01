import app from './src/app'

app.listen(3000, process.env.NODE_ENV === 'development' ? '0.0.0.0' : '', () =>
    console.log(`🚀 Server ready at: http://localhost:3000`)
)
