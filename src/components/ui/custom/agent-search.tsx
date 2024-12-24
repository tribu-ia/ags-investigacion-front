"use client"

import * as React from "react"
import { Check, ChevronsUpDown } from 'lucide-react'
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { z } from "zod"

type Agent = {
  value: string
  label: string
  category: string
  isAssigned: boolean
}

interface AgentsResponse {
  items: Array<{
    isAssigned: boolean
    id: string
    name: string
    category: string
  }>
  total: number
  page: number
  page_size: number
  total_pages: number
}

type AgentSearchProps = {
  onSelect: (value: string) => void
}

const PAGE_SIZE = 600

// Tipo para el payload del investigador
type InvestigadorPayload = {
  name: string;
  email: string;
  phone: string;
  agent: string;
}

// Schema de validación
const formSchema = z.object({
  name: z.string().min(2, "El nombre debe tener al menos 2 caracteres"),
  email: z.string().email("Email inválido"),
  phone: z.string().min(6, "Teléfono inválido"),
  agent: z.string()
})

// Definir una URL base que use la variable de entorno o un fallback
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://tribu-back.pruebas-entrevistador-inteligente.site'

// Agregar un caché global para los agentes
const agentsCache = {
  data: [] as Agent[],
  timestamp: 0,
  CACHE_DURATION: 5 * 60 * 1000 // 5 minutos
}

export function AgentSearch({ onSelect }: AgentSearchProps) {
  const [open, setOpen] = React.useState(false)
  const [value, setValue] = React.useState("")
  const [agents, setAgents] = React.useState<Agent[]>([])
  const [loading, setLoading] = React.useState(false)
  const [page, setPage] = React.useState(1)
  const [hasMore, setHasMore] = React.useState(true)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [showForm, setShowForm] = React.useState(false)
  const [formData, setFormData] = React.useState<InvestigadorPayload>({
    name: '',
    email: '',
    phone: '',
    agent: ''
  })
  const [showQR, setShowQR] = React.useState(false)

  // Agregar una referencia para controlar si ya se hizo la carga inicial
  const initialLoadDone = React.useRef(false)

  // Filtrado local
  const searchLocally = React.useCallback((term: string) => {
    if (!term) return agents
    return agents.filter(agent =>
      agent.label.toLowerCase().includes(term.toLowerCase()) ||
      agent.category.toLowerCase().includes(term.toLowerCase())
    )
  }, [agents])

  // Cargar más agentes, filtrando duplicados
  const loadMoreAgents = React.useCallback(async () => {
    if (!hasMore || loading) return

    try {
      // Verificar si hay datos en caché y si son válidos
      const now = Date.now()
      if (agentsCache.data.length > 0 && 
          (now - agentsCache.timestamp) < agentsCache.CACHE_DURATION) {
        setAgents(agentsCache.data)
        return
      }

      setLoading(true)
      const response = await fetch(
        `${API_BASE_URL}/agents?page=${page}&page_size=${PAGE_SIZE}`
      )
      const data: AgentsResponse = await response.json()

      const newAgents = data.items.map(item => ({
        value: item.id,
        label: item.name,
        category: item.category,
        isAssigned: item.isAssigned
      }))

      // Actualizar el caché
      agentsCache.data = newAgents
      agentsCache.timestamp = now

      setAgents(newAgents)
      setHasMore(data.page < data.total_pages)
      setPage(p => p + 1)
    } catch (error) {
      console.error('Error loading agents:', error)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore, loading])

  // Manejar búsqueda
  const handleSearch = React.useCallback((term: string) => {
    setSearchTerm(term)
  }, [])

  // Carga inicial (solo una vez)
  React.useEffect(() => {
    // Evitar cargas duplicadas
    if (initialLoadDone.current) return
    
    // Reiniciar estados
    setValue("")
    setAgents([])
    setPage(1)
    setHasMore(true)
    setSearchTerm("")
    setFormData({
      name: '',
      email: '',
      phone: '',
      agent: ''
    })
    setShowQR(false)
    setShowForm(false)
    
    // Cargar agentes iniciales
    loadMoreAgents()
    
    // Marcar que ya se hizo la carga inicial
    initialLoadDone.current = true
  }, []) // Se ejecuta solo al montar el componente

  const filteredAgents = searchLocally(searchTerm)
  const categories = Array.from(new Set(filteredAgents.map(agent => agent.category)))

  const noResults = filteredAgents.length === 0
  const shouldShowEmpty = noResults && !loading

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    setIsSubmitting(true)
    try {
      // Enviar el ID real del agente (value), no el searchTerm
      const response = await fetch(`${API_BASE_URL}/investigadores`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...values,
          agent: values.agent,  // agent proviene del formulario parseado, idealmente es 'value'
        })
      })

      if (!response.ok) {
        throw new Error('Error al enviar el formulario')
      }

      // Mostrar QR y limpiar formulario
      setShowQR(true)
      setFormData({
        name: '',
        email: '',
        phone: '',
        agent: ''
      })
      setShowForm(false)
    } catch (error) {
      console.error('Error:', error)
      // Aquí podrías mostrar un mensaje de error al usuario
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleSubmitInvestigador = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Validar datos con Zod antes de enviar
      const validatedData = formSchema.parse(formData)
      await onSubmit(validatedData)
    } catch (error) {
      if (error instanceof z.ZodError) {
        console.error('Validation error:', error.errors)
        // Mostrar los errores de validación al usuario si quieres
      }
    }
  }

  // Función para manejar cambios en el formulario
  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }))
  }

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-full justify-between"
        >
          {value
            ? agents.find((agent) => agent.value === value)?.label
            : "Selecciona un agente..."}
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-full p-0">
        <Command shouldFilter={false}>
          <CommandInput 
            placeholder="Buscar un agente..."
            onValueChange={handleSearch} 
          />
          <CommandList>
            <CommandEmpty>
              {loading ? 'Cargando...' : (
                <div className="text-center p-2">
                  {showQR ? (
                    <div className="p-4">
                      <p className="mb-2">¡Gracias por tu sugerencia!</p>
                      {/* Aquí podrías mostrar un QR o un mensaje de confirmación */}
                      <Button 
                        onClick={() => setShowQR(false)}
                        variant="outline"
                      >
                        Cerrar
                      </Button>
                    </div>
                  ) : (
                    <>
                      <p>No se encontraron agentes.</p>
                      {!showForm && (
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setShowForm(true)}
                          className="mt-2"
                        >
                          Sugerir agregar este agente
                        </Button>
                      )}
                      {showForm && (
                        <form onSubmit={handleSubmitInvestigador} className="mt-4 space-y-3">
                          <div>
                            <input
                              type="text"
                              name="name"
                              placeholder="Nombre"
                              value={formData.name}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border rounded-md"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="email"
                              name="email"
                              placeholder="Email"
                              value={formData.email}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border rounded-md"
                              required
                            />
                          </div>
                          <div>
                            <input
                              type="tel"
                              name="phone"
                              placeholder="Teléfono"
                              value={formData.phone}
                              onChange={handleFormChange}
                              className="w-full px-3 py-2 border rounded-md"
                              required
                            />
                          </div>
                          <div className="flex gap-2">
                            <Button 
                              type="submit" 
                              disabled={isSubmitting}
                              className="w-full"
                            >
                              {isSubmitting ? 'Enviando...' : 'Enviar'}
                            </Button>
                            <Button 
                              type="button" 
                              variant="outline"
                              onClick={() => setShowForm(false)}
                              className="w-full"
                            >
                              Cancelar
                            </Button>
                          </div>
                        </form>
                      )}
                    </>
                  )}
                </div>
              )}
            </CommandEmpty>

            {shouldShowEmpty && (
              <CommandItem
                disabled
                className="justify-center text-sm text-muted-foreground"
                value=""
              >
                No se encontraron agentes.
              </CommandItem>
            )}

            {loading && noResults && (
              <CommandItem
                disabled
                className="justify-center text-sm text-muted-foreground"
                value=""
              >
                Cargando...
              </CommandItem>
            )}

            {/* Agrupamos por categoría */}
            {!noResults && categories.map((category) => (
              <CommandGroup key={category} heading={category}>
                {filteredAgents
                  .filter(agent => agent.category === category)
                  .map(agent => (
                    <CommandItem
                      key={agent.value}
                      value={agent.label}
                      onSelect={() => {
                        if (!agent.isAssigned) {
                          setValue(agent.value)
                          onSelect(agent.value)
                          setFormData(prev => ({ ...prev, agent: agent.value }))
                          setOpen(false)
                        }
                      }}
                      disabled={agent.isAssigned}
                      className={cn(
                        agent.isAssigned && "opacity-50 cursor-not-allowed",
                        "flex items-center justify-between"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        <Check
                          className={cn(
                            "h-4 w-4",
                            value === agent.value ? "opacity-100" : "opacity-0"
                          )}
                        />
                        <span>{agent.label}</span>
                      </div>
                      {agent.isAssigned && (
                        <span className="text-red-500 text-sm font-medium ml-2">
                          En investigación
                        </span>
                      )}
                    </CommandItem>
                  ))}
              </CommandGroup>
            ))}

            {/* Botón de cargar más (si todavía hay más páginas) */}
            {!shouldShowEmpty && !loading && hasMore && (
              <CommandItem
                onSelect={() => loadMoreAgents()}
                className="justify-center text-sm text-muted-foreground"
                value=""
              >
                Cargar más
              </CommandItem>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  )
}
