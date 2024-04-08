import {createAsyncThunk, createSlice} from '@reduxjs/toolkit'

const initialState = {
  token:"",
  loading:false,
  error:""
}

const fetch2 = async (api,body,token="")=>{
  const res = await fetch(api,{
    method:'post',
    headers:{
      "Content-Type": "application/json"
    },
    body:JSON.stringify(body)
  })
  return await res.json()
}

export const signupUser = createAsyncThunk(
  'signupuser',
  async (body) =>{
    const result = await fetch2('/signup', body)
    return result  
  }
)

export const signinUser = createAsyncThunk(
  'signinuser',
  async (body) =>{
    const result = await fetch2('/signin', body)
    return result  
  }
)
const authReducer = createSlice({
  name: "user",
  initialState,
  reducers:{
    addToken:(state,action)=>{
      state.token = localStorage.getItem('token')
    },
    logout:(state,action)=>{
      state.token = null
      localStorage.removeItem('token')
    }

  },
  extraReducers:{
    [signupUser.fulfilled]:(state,{payload:{error,message}})=>{
      state.loading = false
      if(error){
        state.error = error
      }else{
        state.error = message
      }
    },
    [signupUser.pending]:(state,action
    )=>{
      state.loading = true
    },
    [signinUser.pending]:(state,action
    )=>{
      state.loading = true
    },
    [signinUser.fulfilled]:(state,{payload:{error,token}})=>{
      state.loading = false
      if(error){
        state.error = error
      }else{
        state.token = token
        localStorage.setItem('token', token)
      }
    },
  }
})

export const {addToken, logout} = authReducer.actions

export default authReducer.reducer