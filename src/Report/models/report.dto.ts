// TODO: Скорее всего не нужно заводить отдельную сущность под рекламные отчёты, лучше сделать один общий механизм с тасками и хранить эту инфу там

export class reportDto {   
    status:  string
    uuid:    string
    userId:  number
    type:    string
}