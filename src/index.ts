import app from './app'

app.listen(
    parseInt(process.env.PORT || '3000'),
    process.env.NODE_ENV === 'development' ? '0.0.0.0' : '',
    () => console.log(`🚀 Server ready at: http://localhost:3000`)
)
