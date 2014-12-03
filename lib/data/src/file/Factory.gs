import .FS
import .Entry
import .FileEntry
import .DirectoryEntry
import .DirectoryReader
import .FileWriter

class!
	
	def fileSystemCache = null
	def entryCache = null
	
	def constructor()
		@fileSystemCache := {}
		@entryCache := {}
		FS.Factory := @
		Entry.Factory := @
		FileEntry.Factory := @
		DirectoryEntry.Factory := @
		DirectoryReader.Factory := @
	
	def getFileSystem(fs)
		@fileSystemCache[fs.name] ownsor= FS(fs,@)
	
	def getFileEntry(entry,fs)
		@entryCache[entry.filesystem.name&entry.name] ownsor= FileEntry(fs ? @getFileSystem(entry.filesystem),entry,@)
	
	def getDirectoryEntry(entry,fs)
		@entryCache[entry.filesystem.name&entry.name] ownsor= DirectoryEntry(fs ? @getFileSystem(entry.filesystem),entry,@)
	
	@NativeTypes :=
		* FS
		* Entry
		* DirectoryEntry
		* DirectoryReader
		* FileWriter
	
	def isNative(entry)
		for nativeType in Factory.NativeTypes
			if entry instanceof nativeType; return true
		false
	
	def getType(entry)
		if cordova?
			if entry instanceof GLOBAL.FileSystem
				\DOMFileSystem
			else if entry instanceof GLOBAL.DirectoryEntry
				\DirectoryEntry
			else if entry instanceof GLOBAL.FileEntry
				\FileEntry
			else if entry instanceof GLOBAL.DirectoryReader
				\DirectoryReader
			else if entry instanceof GLOBAL.FileWriter
				\FileWriter
		else
			typeof! entry
	
	def get(entry,fs)
		let type = @getType entry
		if @isNative entry
			entry
		else if type == \DOMFileSystem
			@getFileSystem entry
		else if type == \DirectoryEntry
			@getDirectoryEntry entry, fs
		else if type == \FileEntry
			@getFileEntry entry, fs
		else if type == \DirectoryReader
			DirectoryReader entry
		else if type == \FileWriter
			FileWriter entry

class!()