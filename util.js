function repeat(arr, times) {
    return Array.from({ length: times }, () => arr).flat()
}

export {repeat}
