import { WorkbenchTask } from './workbench-task.model';

export const seedWorkbenchTasks = async () => {
  const tasks = [
    {
      code: 'WB-2026-0001',
      title: 'Revisar break de conciliación INDEVAL',
      description:
        'Existe una diferencia nominal entre Calypso e INDEVAL para BONOS M.',
      type: 'RECONCILIATION_BREAK',
      priority: 'HIGH',
      status: 'OPEN',
      assignedTo: 'Back Office Analyst',
      sourceModule: 'Reconciliation',
      sourceReference: 'BONOS-M-BREAK-50000',
      dueDate: new Date('2026-05-01T18:00:00.000Z'),
      comments: [
        {
          author: 'System',
          message: 'Tarea generada automáticamente desde conciliación.',
          createdAt: new Date('2026-04-30T10:00:00.000Z'),
        },
      ],
    },
    {
      code: 'WB-2026-0002',
      title: 'Atender límite excedido en BONOS M',
      description:
        'La exposición actual en BONOS M excede el límite nominal configurado.',
      type: 'RISK_BREACH',
      priority: 'CRITICAL',
      status: 'OPEN',
      assignedTo: 'Risk Analyst',
      sourceModule: 'Risk',
      sourceReference: 'LIM-INST-BONOS-M',
      dueDate: new Date('2026-05-01T15:00:00.000Z'),
      comments: [
        {
          author: 'System',
          message: 'Tarea generada automáticamente desde motor de riesgo.',
          createdAt: new Date('2026-04-30T10:05:00.000Z'),
        },
      ],
    },
    {
      code: 'WB-2026-0003',
      title: 'Validar regla de venta corta fallida',
      description:
        'La regla NO_SHORT_SELL falló para una operación de venta de BONOS M.',
      type: 'COMPLIANCE_FAILED',
      priority: 'CRITICAL',
      status: 'IN_PROGRESS',
      assignedTo: 'Compliance Officer',
      sourceModule: 'Compliance',
      sourceReference: 'NO_SHORT_SELL',
      dueDate: new Date('2026-05-01T16:00:00.000Z'),
      comments: [
        {
          author: 'Compliance Officer',
          message: 'Se está revisando posición disponible contra operación.',
          createdAt: new Date('2026-04-30T10:10:00.000Z'),
        },
      ],
    },
    {
      code: 'WB-2026-0004',
      title: 'Generar informe Banxico pendiente',
      description:
        'El informe Banxico del cierre operativo quedó pendiente de generación.',
      type: 'REPORT_PENDING',
      priority: 'MEDIUM',
      status: 'OPEN',
      assignedTo: 'Regulatory Reporting Analyst',
      sourceModule: 'Reports',
      sourceReference: 'BANXICO-EOD-20260430',
      dueDate: new Date('2026-05-01T12:00:00.000Z'),
      comments: [],
    },
    {
      code: 'WB-2026-0005',
      title: 'Revisión Back Office de repo liquidado',
      description:
        'Operación repo requiere revisión documental posterior a liquidación.',
      type: 'BACK_OFFICE_REVIEW',
      priority: 'LOW',
      status: 'RESOLVED',
      assignedTo: 'Back Office Analyst',
      sourceModule: 'Trades',
      sourceReference: 'TRD-2026-0004',
      dueDate: new Date('2026-05-01T18:00:00.000Z'),
      comments: [
        {
          author: 'Back Office Analyst',
          message: 'Documentación revisada y validada.',
          createdAt: new Date('2026-04-30T11:00:00.000Z'),
        },
      ],
    },
  ];

  await WorkbenchTask.deleteMany({});
  await WorkbenchTask.insertMany(tasks);

  return tasks.length;
};