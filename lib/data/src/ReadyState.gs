import sys.lib.Function

class!
	def _readyState = 1
	def waiters = null
	dyn getIsReady() -> @_readyState == 0 
	
	def constructor()
		@waiters := []
	
	def wait(waitFor)
		@_readyState += 1
		if waitFor?
			let readyState = if waitFor instanceof ReadyState; waitFor
			else if waitFor.readyState instanceof ReadyState; waitFor.readyState
			readyState.whenReady #@! @ready()
		waitFor
	
	def waitFor(waitFor) -> @wait waitFor

	def ready()!
		if (@_readyState -= 1) == 0
			// We copy and reassign before we sleep
			// so that there is if for some reason
			// a waiter is added during execution, it
			// won't be reset.
			let waiters = @waiters.concat()
			@waiters := []
			// execute the waiters outside of this context
			//sleep 0 // I can't remember why I had this :(
			for waiter in waiters; waiter()
	
	def whenReady(cb)
		if @_readyState == 0; cb()
		else; @waiters.push cb
	